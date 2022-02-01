const { getPool } = require("../../database/pool");
const SQL = require("sql-template-strings");
const buildQuery = require("../../database/buildQuery");
const {
  filtersToConditions,
  mapFiltersToColumns,
} = require("../../database/rhsFilters");

const count = async (filters, connection = getPool()) => {
  const columns = {
    isPrivate: "video.is_private",
    timesViewed: "view_counter.times_viewed",
  };
  const [result] = await connection.query(
    buildQuery(
      SQL` SELECT`,
      SQL` COUNT(*) totalCount`,
      SQL` FROM tbl_video AS video`,
      SQL` LEFT JOIN tbl_view_counter AS view_counter`,
      SQL` ON video.id = view_counter.video_id`,
      SQL` WHERE 1=1 `,
      ...filtersToConditions(mapFiltersToColumns(filters, columns))
    )
  );

  return result[0].totalCount;
};

module.exports = count;
