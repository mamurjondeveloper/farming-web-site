const express = require("express");

const { loginAdmin, getCurrentAdmin, registerAdmin, registerPublic, updateProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public auth endpoints
router.post("/login", loginAdmin);
router.post("/register-public", registerPublic);

// Protected endpoints
router.get("/me", protect, getCurrentAdmin);
router.post("/register", protect, registerAdmin);
router.put("/profile", protect, updateProfile);

module.exports = router;
