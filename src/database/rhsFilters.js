const SQL = require("sql-template-strings");

const mapFiltersToColumns = (filters, columns) =>
  filters.map((filter) => {
    const { name } = filter;
    const column = columns[name];

    if (column === undefined) {
      throw new Error(`Undefined column name for filter '${name}'`);
    }

    return Object.assign({}, filter, { column });
  });

const toSqlCondition = ({ filter, value, column }) => {
  switch (filter) {
    default:
      throw new Error(`Invalid filter ${filter} for ${column}`);
    case "bool":
      return SQL` AND (`.append(column).append(` = ${value})`);
    case "exact":
      return SQL` AND (`.append(column).append(` = ${value})`);
    case "gt":
      return SQL` AND (`.append(column).append(` > ${value})`);
    case "gte":
      return SQL` AND (`.append(column).append(` >= ${value})`);
    case "lt":
      return SQL` AND (`.append(column).append(` < ${value})`);
    case "lte":
      return SQL` AND (`.append(column).append(` <= ${value})`);
  }
};

module.exports = {
  filtersToConditions: (filters) => filters.map(toSqlCondition),
  mapFiltersToColumns,
};
