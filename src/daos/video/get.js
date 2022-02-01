const { getPool } = require("../../database/pool");
const SQL = require("sql-template-strings");

const byProperties = require("./map");
const buildQuery = require("../../database/buildQuery");

const getVideoById = async (id, connection = getPool()) => {
  const [result] = await connection.query(
    buildQuery(
      SQL` SELECT `,
      SQL`  video.id, video.name, video.url, video.thumbnail_url thumbnailUrl, is_private isPrivate,`,
      SQL`  IFNULL(view_counter.times_viewed,0) timesViewed, video.created_at createdAt, video.updated_at updatedAt `,
      SQL` FROM tbl_video AS video `,
      SQL` LEFT JOIN tbl_view_counter AS view_counter`,
      SQL` ON video.id = view_counter.video_id`,
      SQL` WHERE video.id = ${id}`
    )
  );
  if (!result[0]) {
    return null;
  }
  return byProperties(result[0]);
};

module.exports = getVideoById;
