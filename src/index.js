const express = require("express");
const { initDatabase, initLogger } = require("./init");
const { dependencyInjector } = require("./middlewares");
const setupRoutes = require("./routes/setupRoutes");

const start = async () => {
  const app = express();
  app.use(express.json());

  const logger = initLogger();
  const db = await initDatabase(logger);

  app.set("logger", logger);
  app.set("db", db);

  app.use((req, res, next) => {
    req.app.locals.logger = app.get("logger");
    req.app.locals.db = app.get("db");
    next();
  });

  // inject dependency kalo udah dibuat ya
//   app.use(dependencyInjector());

  //setup routes
  setupRoutes(app, logger);

  // ---------------- START ----------------
  // Start Server
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

// Run the server
start();
