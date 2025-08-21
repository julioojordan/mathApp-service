const handleError = (res, logger, err) => {
  const status = err.status || 500;

  logger.error(err, `Response: ${status} - ${err.message || "Unknown error"}`);

  return res.status(status).json({
    code: status,
    error: err.error || getStatusMessage(status),
    message: err.message || "Something went wrong"
  });
};

const getStatusMessage = (statusCode) => {
  const messages = {
    400: "BadRequest",
    401: "Unauthorized",
    403: "Forbidden",
    404: "NotFound",
    409: "Conflict",
    422: "UnprocessableEntity",
    500: "InternalServerError",
  };
  return messages[statusCode] || "UnknownError";
};

module.exports = handleError;
