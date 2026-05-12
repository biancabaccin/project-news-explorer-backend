const Article = require("../models/article");

module.exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ owner: req.user._id });
    return res.status(200).send(articles);
  } catch (err) {
    return res.status(500).send({ message: "Server error" });
  }
};

module.exports.createArticle = async (req, res) => {
  try {
    const article = await Article.create({
      ...req.body,
      owner: req.user._id,
    });

    return res.status(201).send(article);
  } catch (err) {
    return res.status(400).send({ message: "Bad request" });
  }
};

module.exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);

    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }

    if (article.owner.toString() !== req.user._id) {
      return res.status(403).send({ message: "Forbidden" });
    }

    await article.deleteOne();

    return res.send({ message: "Article deleted" });
  } catch (err) {
    return res.status(500).send({ message: "Server error" });
  }
};
