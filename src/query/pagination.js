const url = require("url");
const BadRequestError = require("../errors/badRequest");

//Avoid DOS attack
const controlMaxLimit = (limit, max = 100) => (limit <= 100 ? limit : max);

const parseUrl = (requestUrl) => {
  const {
    query: { page = 0, limit = 20 },
  } = url.parse(requestUrl, true);

  return {
    page: parseInt(page),
    limit: controlMaxLimit(parseInt(limit)),
  };
};

const getPaginationParams = (requestUrl) => {
  const { page, limit } = parseUrl(requestUrl);

  if (!Number.isInteger(page)) {
    throw new BadRequestError("page must be an integer", -103);
  }

  if (!Number.isInteger(limit)) {
    throw new BadRequestError("limit must be an integer", -104);
  }

  return { page, limit };
};

const getPageCount = (totalCount, limit) => Math.ceil(totalCount / limit);

module.exports = { getPaginationParams, getPageCount };
