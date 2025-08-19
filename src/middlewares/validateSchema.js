const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        details: error.details.map(d => d.message)
      });
    }
    req.validated = value;
    next();
  };
}

module.exports = validateSchema