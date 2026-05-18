const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const err = new Error("Authorization required");

    err.statusCode = 401;

    return next(err);
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const { NODE_ENV, JWT_SECRET } = process.env;
    const secret = NODE_ENV === "production" ? JWT_SECRET : "dev-secret";

    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (err) {
    err.statusCode = 401;
    err.message = "Invalid token";

    return next(err);
  }
};
