const handleError = require("../helpers/handleErrorHelper");

const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
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

    req.validated = value;
    next();
  };
};

module.exports = validateSchema;
