require("dotenv").config();
const { Pool } = require("pg");

const initDatabase = async (logger) => {
  try {
    const {
      DB_HOST = "localhost",
      DB_PORT = "5432",
      DB_USER = "postgres",
      DB_PASSWORD = "root",
      DB_NAME = "math_app",
      DB_MAX_CONNS = "50",
      DB_IDLE_TIMEOUT_MS = "30000",
      DB_CONN_TIMEOUT_MS = "5000",
      DB_SSL = "false",
      DB_SSL_REJECT_UNAUTH = "false",
    } = process.env;

    const pool = new Pool({
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      max: parseInt(DB_MAX_CONNS, 10),
      idleTimeoutMillis: parseInt(DB_IDLE_TIMEOUT_MS, 10),
      connectionTimeoutMillis: parseInt(DB_CONN_TIMEOUT_MS, 10),
      ssl: DB_SSL === "true"
        ? { rejectUnauthorized: DB_SSL_REJECT_UNAUTH === "true" }
        : undefined,
    });

    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    logger.info("PostgreSQL connected successfully");

    return pool;
  } catch (err) {
    logger.error(err, "PostgreSQL connection failed");
    throw err;
  }
}

module.exports = initDatabase;
