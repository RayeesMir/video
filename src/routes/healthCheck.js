const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    res.status(200).send("OK");
  })
);

module.exports = router;
