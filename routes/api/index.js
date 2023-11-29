const router = require('express').Router();
const friendRoutes = require("./friendRoutes");
const likeRoutes = require("./likeRoutes");
const thoughtRoutes = require("./thoughtRoutes");
const userRoutes = require("./userRoutes");

router.use("/friends", friendRoutes);
router.use("/likes", likeRoutes);
router.use("/thoughts", thoughtRoutes);
router.use("./users", userRoutes);

module.exports = router;