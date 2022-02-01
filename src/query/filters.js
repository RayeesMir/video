const filterParser = require("./filterParser");

const enumerable = filterParser(
  ["exact", "gt", "gte", "lt", "lte"],
  "enumerable"
);
const bool = filterParser(["bool"], "bool");

module.exports = {
  enumerable,
  bool,
};
