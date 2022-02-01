const { getPool } = require("../../database/pool");
const SQL = require("sql-template-strings");

const validateVideoExists = require("./validators/exists");

const remove = async (id) => {
  await validateVideoExists(id);
  await getPool().query(SQL` DELETE FROM tbl_video WHERE id = ${id} `);
};

module.exports = remove;
