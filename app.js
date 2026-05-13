require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const { errors } = require("celebrate");

const routes = require("./routes");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

app.use(express.json());

app.use(requestLogger);

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

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "Server error" : message,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
