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
        message: "Login/Email va parol majburiy",
      });
    }

    // Username ham, email ham bo'lishi mumkin
    const admin = await getQuery("SELECT * FROM admins WHERE username = ? OR email = ?", [String(username).trim(), String(username).trim()]);

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
        email: admin.email,
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

// Ommaviy(public) ro'yxatdan o'tish
exports.registerPublic = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Barcha maydonlarni to'ldiring" });
    }

    // Email yoki username bandligini tekshirish
    const existsUsername = await getQuery("SELECT id FROM admins WHERE username = ?", [username]);
    if (existsUsername) {
       return res.status(400).json({ success: false, message: "Bu foydalanuvchi nomi band" });
    }

    const existsEmail = await getQuery("SELECT id FROM admins WHERE email = ?", [email]);
    if (existsEmail) {
       return res.status(400).json({ success: false, message: "Bu email orqali ro'yxatdan o'tilgan" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newId = crypto.randomUUID();
    const newRole = "user";

    await runQuery("INSERT INTO admins (id, username, email, passwordHash, role) VALUES (?, ?, ?, ?, ?)", [newId, username, email, passwordHash, newRole]);

    // Avtomat login qilib yuboramiz
    const token = jwt.sign(
      { id: newId, username, role: newRole },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.status(201).json({ 
      success: true, 
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
      token,
      admin: {
         id: newId,
         username,
         email,
         role: newRole
      }
    });

  } catch (err) {
    return next(err);
  }
};

// Profilni tahrirlash
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.admin.id;
    const { username, email, password } = req.body;

    // Tekshiramiz email band emasligini o'ziga tegishlilardan tashqari
    if (username) {
       const uCheck = await getQuery("SELECT id FROM admins WHERE username = ? AND id != ?", [username, userId]);
       if (uCheck) return res.status(400).json({ success: false, message: "Username allaqachon mavjud" });
    }
    
    if (email) {
       const eCheck = await getQuery("SELECT id FROM admins WHERE email = ? AND id != ?", [email, userId]);
       if (eCheck) return res.status(400).json({ success: false, message: "Ushbu email boshqa hisobga ulangan" });
    }

    const currentUser = await getQuery("SELECT * FROM admins WHERE id = ?", [userId]);
    let newPasswordHash = currentUser.passwordHash;
    if (password) {
       const salt = await bcrypt.genSalt(10);
       newPasswordHash = await bcrypt.hash(password, salt);
    }

    await runQuery(
      "UPDATE admins SET username = ?, email = ?, passwordHash = ? WHERE id = ?",
      [username || currentUser.username, email || currentUser.email, newPasswordHash, userId]
    );

    const updatedUser = await getQuery("SELECT id, username, email, role FROM admins WHERE id = ?", [userId]);
    return res.status(200).json({ success: true, message: "Profil yangilandi", admin: updatedUser });

  } catch (err) {
    return next(err);
  }
};
