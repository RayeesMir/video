const NotFoundError = require('../errors/notFound')

const notFoundRoute = (req, res, next) => {
  next(new NotFoundError(-113))
}

module.exports = notFoundRoute