const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

module.exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("email name");

    if (!user) {
      const err = new Error("User not found");

      err.statusCode = 404;

      return next(err);
    }
    return res.status(200).send(user);
  } catch (err) {
    return next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hash,
      name,
    });

    return res.status(201).send({
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    if (err.code === 11000) {
      err.statusCode = 409;
      err.message = "Email already exists";
    }

    if (err.name === "ValidationError") {
      err.statusCode = 400;
    }

    return next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const err = new Error("Incorrect email or password");

      err.statusCode = 401;

      return next(err);
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      const err = new Error("Incorrect email or password");

      err.statusCode = 401;

      return next(err);
    }

    const { NODE_ENV, JWT_SECRET } = process.env;

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
      { expiresIn: "7d" },
    );

    return res.send({ token });
  } catch (err) {
    return next(err);
  }
};
