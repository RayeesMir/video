const { getPool } = require("../../database/pool");
const SQL = require("sql-template-strings");

const getVideoById = require("./get");
const buildQuery = require("../../database/buildQuery");
const { random } = require("lodash");

const create = async ({ name, url, thumbnailUrl, isPrivate }) => {
  const connection = await getPool().getConnection();
  try {
    await connection.query("START TRANSACTION");
    const private = isPrivate ? 1 : 0;
    const [video] = await connection.query(
      buildQuery(
        SQL` INSERT INTO tbl_video (name, url, thumbnail_url, is_private) `,
        SQL` VALUES ( ${name}, ${url}, ${thumbnailUrl}, ${private}) `
      )
    );

    const { insertId: videoId } = video;
    
    // This must be alway 0 for all videos. 
    //  Reasons for setting to random:
    //  I am using POST endpoint for seeding. 
    //  to have random views count
    const views = random(0, 100);

    await connection.query(
      buildQuery(
        SQL` INSERT INTO tbl_view_counter (video_id, times_viewed) `,
        SQL` VALUES ( ${videoId}, ${views}) `
      )
    );

    await connection.query("COMMIT");
    connection.release();

    return getVideoById(videoId);
  } catch (error) {
    await connection.query("ROLLBACK");
    connection.release();
    throw error;
  }
};

module.exports = create;
