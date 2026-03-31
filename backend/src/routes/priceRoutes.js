const express = require("express");

const {
  getAllPrices,
  getPriceById,
  createPrice,
  updatePrice,
  deletePrice,
} = require("../controllers/priceController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public: barcha narx yozuvlari
router.get("/", getAllPrices);

// Public: bitta narx yozuvi
router.get("/:id", getPriceById);

// Protected: yangi narx kiritish
router.post("/", protect, createPrice);

// Protected: narx yozuvini yangilash
router.put("/:id", protect, updatePrice);

// Protected: narx yozuvini o'chirish
router.delete("/:id", protect, deletePrice);

module.exports = router;
