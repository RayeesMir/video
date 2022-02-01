const { getPool } = require("../../database/pool");
const SQL = require("sql-template-strings");

const getVideoById = require("./get");

const validateVideoExists = require("./validators/exists");

const update = async ({ id, name, url, thumbnailUrl, isPrivate } = {}) => {
  await validateVideoExists(id);

  await getPool().query(
    SQL` 
        UPDATE tbl_video
            SET name=${name}, url=${url}, thumbnail_url=${thumbnailUrl}, is_private=${isPrivate} 
        WHERE id=${id} `
  );

  return getVideoById(id);
};

module.exports = update;
