const buildQuery = (query, ...appendees) =>
  appendees.reduce((accumulator, appendee) => {
    if (appendee) {
      return accumulator.append(appendee);
    }

    return accumulator;
  }, query);

module.exports = buildQuery;
