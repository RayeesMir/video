const BaseError = require('./base')

class NotFoundError extends BaseError {
  constructor(errorCode) {
    super('Not Found', 404, errorCode)
  }
}

module.exports = NotFoundError
