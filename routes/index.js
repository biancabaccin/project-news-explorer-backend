const router = require("express").Router();
const userRoutes = require("./users");
const articleRoutes = require("./articles");

router.use("/", userRoutes);
router.use("/", articleRoutes);

module.exports = router;
