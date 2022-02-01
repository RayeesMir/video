const { v4: uuidv4 } = require("uuid");

const log = ({ traceId = uuidv4(), ...rest }) => {
  const now = new Date();

  console.log(
    JSON.stringify({
      time: now.toISOString(),
      traceId,
      ...rest,
    })
  );
};

const logError = ({ req, response, statusCode, error }) =>
  log({
    traceId: req.traceId,
    clientIp: req.ip,
    host: req.hostname,
    url: req.url,
    method: req.method,
    requestBody: req.body,
    requestParams: req.params,
    requestHeaders: req.headers,
    response,
    statusCode,
    error,
    errorStack: error.stack,
  });

module.exports = { log, logError };
