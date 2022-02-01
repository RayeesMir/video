const getVideoById = require("../get");
const { VideoNotFoundError } = require("../errors");

const validateClientCode = async (id) => {
  const video = await getVideoById(id);

  if (!video) {
    throw new VideoNotFoundError();
  }
};

module.exports = validateClientCode;
