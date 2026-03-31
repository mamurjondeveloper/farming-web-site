const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { getQuery, runQuery } = require("../config/db");

exports.loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username va password majburiy",
      });
    }

    const admin = await getQuery("SELECT * FROM admins WHERE username = ?", [String(username).trim()]);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Login yoki parol noto'g'ri",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Login yoki parol noto'g'ri",
      });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Muvaffaqiyatli tizimga kirdingiz",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.getCurrentAdmin = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.admin,
  });
};

exports.registerAdmin = async (req, res, next) => {
  try {
    if (!req.admin || req.admin.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Ruxsat etilmagan" });
    }

    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username va password kerak" });
    }

    const exists = await getQuery("SELECT id FROM admins WHERE username = ?", [username]);
    if (exists) {
      return res.status(400).json({ success: false, message: "Username band" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newId = crypto.randomUUID();
    const newRole = role === "superadmin" ? "superadmin" : "editor";

    await runQuery("INSERT INTO admins (id, username, passwordHash, role) VALUES (?, ?, ?, ?)", [newId, username, passwordHash, newRole]);

    return res.status(201).json({ success: true, message: "Yangi admin yaratildi" });
  } catch (err) {
    return next(err);
  }
};

