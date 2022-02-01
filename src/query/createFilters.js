const url = require('url')
const {flatten} = require('lodash')

const createFilters = (requestUrl, ...parsers) => {
  const {query} = url.parse(requestUrl, true)

  return flatten(parsers.map(parser => parser(query)))
}

module.exports = createFilters
