const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getMe, createUser, login } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.get("/users/me", auth, getMe);

module.exports = router;
