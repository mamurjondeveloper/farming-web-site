const express = require("express");

const { loginAdmin, getCurrentAdmin, registerAdmin } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin login endpoint
router.post("/login", loginAdmin);

// Admin register endpoint (faqat tizimga kirgan va superadmin huquqli adminlar ishlata oladi)
router.post("/register", protect, registerAdmin);

// Token yaroqliligini tekshirish uchun himoyalangan endpoint
router.get("/me", protect, getCurrentAdmin);

module.exports = router;
