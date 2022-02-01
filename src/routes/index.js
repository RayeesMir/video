const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");

const validateRequestProperty = require("../middlewares/validateRequestProperty");
const videoSchema = require("../schemas/video.json");

const create = require("../daos/video/create");
const update = require("../daos/video/update");

const { VideoNotFoundError } = require("../daos/video/errors");
const NotFoundError = require("../errors/notFound");


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

router.put(
  "/:id",
  validateRequestProperty(-105, videoSchema, "body"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, url, thumbnailUrl, isPrivate } = req.body;

    try {
      const video = await update({
        id,
        name,
        url,
        thumbnailUrl,
        isPrivate,
      });

      res.status(200).json(video);
    } catch (error) {
      switch (error.constructor) {
        case VideoNotFoundError:
          throw new NotFoundError(-106);
        default:
          throw error;
      }
    }
  })
);


module.exports = router;
