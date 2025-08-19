require("dotenv").config();
const pino = require("pino");

const redactPathDefault = [
    'authorization', 'password'
]
const initLogger = () => {
  const { LOG_LEVEL = "info" } = process.env;

  return pino({
    level: LOG_LEVEL,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      }
    },
    serializers: pino.stdSerializers,
    name: "main",
    redact: {
        paths: [... redactPathDefault],
        censor: '<Redacted>'
    }
  });
}

module.exports = initLogger;
