const { BadRequestError } = require("../errors/badRequest");

const filterParser = (validFilters, type) => (filterName) => (query) => {
  const parameter = query[filterName];

  if (parameter === undefined) {
    return [];
  }

  // Avoid parameter pollution attack
  if (Array.isArray(parameter)) {
    throw new BadRequestError(`Multiple filters for '${filter}'`, -102);
  }

  const param = parameter.split(":");
  const filter = param.shift();
  const value = param.join(":");

  if (!validFilters.includes(filter)) {
    throw new BadRequestError(
      `Invalid filter '${filter}' for type '${type}'`,
      -103
    );
  }

  return {
    name: filterName,
    filter,
    value,
  };
};
module.exports = filterParser;
