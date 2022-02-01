const BaseError = require("../errors/base");
const { logError } = require("../errors/logger");

const createResponse = ({ error, traceId }) => {
  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    error.type === "entity.parse.failed" &&
    "body" in error
  ) {
    return {
      errorCode: -100,
      message: "Invalid Payload",
      traceId,
    };
  }

  if (error instanceof BaseError) {
    const { errorCode, message } = error;
    return { errorCode, message, traceId: error.traceId || traceId };
  }

  return {
    errorCode: -101,
    message: "Internal Server Error",
    traceId,
  };
};

const getStatusCode = (error) => {
  return error instanceof BaseError || error instanceof SyntaxError
    ? error.statusCode
    : 500;
};

const errorMiddleware = (error, req, res, next) => {
  const traceId = req.traceId;
  const statusCode = getStatusCode(error);
  const response = createResponse({ statusCode, error, traceId });

  logError({ error, req, traceId, statusCode, response });

  if (!res.headersSent) {
    res.status(statusCode).json(response);
  }
};

module.exports = errorMiddleware;
