const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require("../controllers/articles");

router.get("/articles", auth, getArticles);
router.post("/articles", auth, createArticle);
router.delete("/articles/:articleId", auth, deleteArticle);

module.exports = router;
