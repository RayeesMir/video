const getFilter = (name, filters) =>
  filters
    .filter(({name: filterName}) => filterName === name)
    .map(({filter, value}) => ({filter, value}))

module.exports = getFilter
