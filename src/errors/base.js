class BaseError extends Error {
  constructor(message, statusCode, errorCode, traceId) {
    super(message)

    this.statusCode = statusCode
    this.errorCode = errorCode
    this.traceId = traceId
  }
}

module.exports = BaseError
