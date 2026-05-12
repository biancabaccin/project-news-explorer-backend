const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const { NODE_ENV, JWT_SECRET } = process.env;
    const secret = NODE_ENV === "production" ? JWT_SECRET : "dev-secret";

    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid token" });
  }
};
