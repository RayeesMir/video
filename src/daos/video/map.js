const map = ({
  id,
  name,
  url,
  thumbnailUrl,
  isPrivate,
  timesViewed,
  createdAt,
  updatedAt,
}) => ({
  id,
  name,
  url,
  thumbnailUrl,
  isPrivate: isPrivate == 0 ? false : true,
  timesViewed,
  createdAt,
  updatedAt,
});
module.exports = map;
