const { getPool } = require("../../database/pool");
const SQL = require("sql-template-strings");
const {
  mapFiltersToColumns,
  filtersToConditions,
} = require("../../database/rhsFilters");
const byProperties = require("./map");
const buildQuery = require("../../database/buildQuery");

const listVideos = async ({ page, limit, filters }) => {
  const start = page * limit;
  const columns = {
    isPrivate: "video.is_private",
    timesViewed: "view_counter.times_viewed",
  };

  const [result] = await getPool().query(
    buildQuery(
      SQL` SELECT`,
      SQL` video.id, video.name, video.url, video.thumbnail_url AS thumbnailUrl, video.is_private AS isPrivate, `,
      SQL` IFNULL(view_counter.times_viewed,0) AS timesViewed, video.created_at, video.updated_at`,
      SQL` FROM tbl_video AS video`,
      SQL` LEFT JOIN tbl_view_counter AS view_counter`,
      SQL` ON video.id = view_counter.video_id`,
      SQL` WHERE 1=1 `,
      ...filtersToConditions(mapFiltersToColumns(filters, columns)),
      SQL` LIMIT ${start}, ${limit} `
    )
  );

  return result.map(byProperties);
};

module.exports = listVideos;
