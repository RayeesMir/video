const BaseError = require('./base')

class BadRequestError extends BaseError {
  constructor(message, errorCode, metadata) {
    super('Bad Request: ' + message, 400, errorCode)
    this.metadata = metadata
  }
}

module.exports = BadRequestError
