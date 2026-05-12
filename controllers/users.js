const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

module.exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("email name");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ message: "Server error" });
  }
};

module.exports.createUser = async (req, res) => {
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
      return res.status(409).send({
        message: "Email already exists",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation error",
      });
    }

    return res.status(500).send({
      message: "Server error",
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).send({
        message: "Incorrect email or password",
      });
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(401).send({
        message: "Incorrect email or password",
      });
    }

    const { NODE_ENV, JWT_SECRET } = process.env;

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
      { expiresIn: "7d" },
    );

    return res.send({ token });
  } catch (err) {
    return res.status(500).send({
      message: "Server error",
    });
  }
};
