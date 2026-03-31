const express = require("express");
const { getTickers, createTickerItem, toggleTickerVisibility, addTickerHistory, deleteTickerHistory, deleteTickerItem } = require("../controllers/tickerController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Ticker va uning narx tarixlarini olish (Public ruxsat)
router.get("/", getTickers);

// Ticker obyekti kiritish (Adminlar uchun)
router.post("/", protect, createTickerItem);

// Ticker obyektiga tarix sifatida yangi joriy kun narxini qoshish
router.post("/:id/history", protect, addTickerHistory);

// Ticker tarixidagi aniq bitta xato logni o'chirish
router.delete("/history/:historyId", protect, deleteTickerHistory);

// Ticker obyektining Publicda ko'rinib yoki yashirinishini o'zgartirish
router.put("/:id/toggle", protect, toggleTickerVisibility);

// Ticker obyektini butunlay o'chirish
router.delete("/:id", protect, deleteTickerItem);

module.exports = router;
