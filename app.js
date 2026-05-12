const express = require("express");
const routes = require("./routes");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

app.use(express.json());

app.use(requestLogger);

app.use("/", routes);

app.use((req, res) => {
  res.status(404).send({
    message: "Requested resource not found",
  });
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "JsonWebTokenError") {
    return res.status(401).send({
      message: "Invalid token",
    });
  }

  return res.status(500).send({
    message: "Server error",
  });
});

module.exports = app;
