const Redis = require("ioredis");

const initRedisClient = async (logger) => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    db: process.env.REDIS_DB || 0,
    lazyConnect: true,
  });

  try {
    await redis.connect();
    logger.info("Connected to Redis");
  } catch (err) {
    logger.error(err, "Redis connection failed");
    throw err;
  }

  redis.on("error", (err) => {
    logger.error(err, "Redis runtime error");
  });

  return redis;
};

module.exports = initRedisClient;
