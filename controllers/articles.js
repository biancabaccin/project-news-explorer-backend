const Article = require("../models/article");

module.exports.getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user._id });
    return res.status(200).send(articles);
  } catch (err) {
    return next(err);
  }
};

module.exports.createArticle = async (req, res, next) => {
  try {
    const article = await Article.create({
      ...req.body,
      owner: req.user._id,
    });

    return res.status(201).send(article);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.statusCode = 400;
    }

    return next(err);
  }
};

module.exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.articleId);

    if (!article) {
      const err = new Error("Article not found");

      err.statusCode = 404;

      return next(err);
    }

    if (!article.owner.equals(req.user._id)) {
      const err = new Error("Forbidden");

      err.statusCode = 403;

      return next(err);
    }
    await article.deleteOne();

    return res.send({ message: "Article deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      err.statusCode = 400;
      err.message = "Invalid article id";
    }

    return next(err);
  }
};
