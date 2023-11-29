const router = require("express").Router();
const apiRoutes = require("./api");

router.use("/api", apiRoutes);
router.use((req, res) => res.send('<h4>404 Not Found</h4>'));

module.exports = router;

