const { v4: uuidv4 } = require("uuid");

const attachTraceId = (req, res, next) => {
  req.traceId = uuidv4();
  res.set("x-trace-id", req.traceId);
  next();
};

module.exports = attachTraceId;
