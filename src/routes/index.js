const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");

const validateRequestProperty = require("../middlewares/validateRequestProperty");
const videoSchema = require("../schemas/video.json");

const create = require("../daos/video/create");

router.post(
  "/",
  validateRequestProperty(-104, videoSchema, "body"),
  asyncHandler(async (req, res) => {
    const { name, url, thumbnailUrl, isPrivate } = req.body;

    try {
      const video = await create({
        name,
        url,
        thumbnailUrl,
        isPrivate,
      });

      res.status(201).json(video);
    } catch (error) {
      throw error;
    }
  })
);


module.exports = router;
