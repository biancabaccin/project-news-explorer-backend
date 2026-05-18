const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  validateArticle,
  validateArticleId,
} = require("../middlewares/validation");

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require("../controllers/articles");

router.get("/articles", auth, getArticles);

router.post("/articles", auth, validateArticle, createArticle);

router.delete("/articles/:articleId", auth, validateArticleId, deleteArticle);

module.exports = router;
