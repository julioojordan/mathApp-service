const express = require("express");
const { initDatabase, initLogger, initRedisClient } = require("./init");
const { dependencyInjector } = require("./middlewares");
const setupRoutes = require("./routes/setupRoutes");

const start = async () => {
  const app = express();
  app.use(express.json());

  const logger = initLogger();
  let db, redis, server;

  try {
    db = await initDatabase(logger);
    redis = await initRedisClient(logger);
  } catch (err) {
    logger.error(err, "❌ Critical error during startup. Exiting...");
    process.exit(1);
  }

  app.set("logger", logger);
  app.set("db", db);
  app.set("redis", redis);

  app.use((req, res, next) => {
    req.app.locals.logger = logger;
    req.app.locals.db = db;
    req.app.locals.redis = redis;
    next();
  });

  app.use(dependencyInjector());
  setupRoutes(app, logger);

  const PORT = process.env.PORT || 3001;
  server = app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on port ${PORT}`);
  });

  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Gracefully shutting down...`);

    try {
      logger.info("Closing Redis connection...");
      await redis.quit();

      logger.info("Closing PostgreSQL connection...");
      await db.end();

      logger.info("Stopping Express server...");
      server.close(() => {
        logger.info("Shutdown complete.");
        process.exit(0);
      });

      setTimeout(() => {
        logger.warn("Forcefully shutting down after timeout.");
        process.exit(1);
      }, 10000);
    } catch (err) {
      logger.error(err, "Error during shutdown");
      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

start();
