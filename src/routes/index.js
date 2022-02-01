const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");

const validateRequestProperty = require("../middlewares/validateRequestProperty");
const videoSchema = require("../schemas/video.json");

const create = require("../daos/video/create");
const update = require("../daos/video/update");

const list = require("../daos/video/list");
const count = require("../daos/video/count");

const { getPaginationParams, getPageCount, getFilter } = require("../query");

const { VideoNotFoundError } = require("../daos/video/errors");
const NotFoundError = require("../errors/notFound");
const { enumerable, bool } = require("../query/filters");
const createFilters = require("../query/createFilters");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page, limit } = getPaginationParams(req.url);
    const filters = createFilters(
      req.url,
      bool("isPrivate"),
      enumerable("timesViewed")
    );

    const [videos, totalCount] = await Promise.all([
      list({ filters, page, limit }),
      count(filters),
    ]);

    return res.json({
      videos,
      totalCount,
      limit,
      pageCount: getPageCount(totalCount, limit),
      page,
      isPrivate: getFilter("isPrivate", filters),
      timesViewed: getFilter("timesViewed", filters),
    });
  })
);

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
