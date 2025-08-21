const handleError = require("../helpers/handleErrorHelper");

const validateSchema = (schema, type = "body") => {
  return (req, res, next) => {
    const data = req[type];
    const { error, value } = schema.validate(data, { abortEarly: false });
    const logger = req.app.locals.logger;

    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      const validationError = {
        status: 400,
        error: "Validation",
        message,
      };

      return handleError(res, logger, validationError);
    }

    if (!req.validated) req.validated = {};
    req.validated[type] = value;

    next();
  };
};

module.exports = validateSchema;
