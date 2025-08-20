const handleError = (res, logger, err) => {
  const status = err.status || 500;
  const isCustom = !!err.status;

  logger.error(err, `Response: ${status} - ${err.message || "Unknown error"}`);

  return res.status(status).json({
    code: status,
    status: getStatusMessage(status),
    message: isCustom ? err.message : "Something went wrong",
  });
};

const getStatusMessage = (statusCode) => {
  const messages = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
  };
  return messages[statusCode] || "Unknown Error";
};

module.exports = handleError;
