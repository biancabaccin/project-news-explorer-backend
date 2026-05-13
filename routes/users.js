const router = require("express").Router();
const auth = require("../middlewares/auth");

const { validateSignup, validateSignin } = require("../middlewares/validation");

const { getMe, createUser, login } = require("../controllers/users");

router.post("/signup", validateSignup, createUser);

router.post("/signin", validateSignin, login);

router.get("/users/me", auth, getMe);

module.exports = router;
