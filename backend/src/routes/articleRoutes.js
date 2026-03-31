const express = require("express");

const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public: barcha maqolalar
router.get("/", getAllArticles);

// Public: bitta maqola
router.get("/:id", getArticleById);

// Protected: yangi maqola
router.post("/", protect, createArticle);

// Protected: maqolani yangilash
router.put("/:id", protect, updateArticle);

// Protected: maqolani o'chirish
router.delete("/:id", protect, deleteArticle);

module.exports = router;
