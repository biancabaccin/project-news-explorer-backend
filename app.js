require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const { errors } = require("celebrate");

const routes = require("./routes");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const rateLimiter = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

const allowedCors = [
  "https://project-news-explorer-frontend.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS";

app.use(function (req, res, next) {
  const { origin } = req.headers;
  const { method } = req;

  if (allowedCors.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);

  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.use(requestLogger);

app.use(rateLimiter);

app.use("/", routes);

mongoose.connect(process.env.MONGO_URI);

const PORT = process.env.PORT;

app.use((req, res, next) => {
  const err = new Error("Requested resource not found");

  err.statusCode = 404;

  next(err);
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
