const fs = require("fs/promises");
const path = require("path");
const jwt = require("jsonwebtoken");

const ADMINS_FILE_PATH = path.join(__dirname, "..", "data", "admins.json");

async function readAdmins() {
  // Har safar eng yangi holatni olish uchun JSON fayldan o'qiymiz
  const fileContent = await fs.readFile(ADMINS_FILE_PATH, "utf-8");
  return JSON.parse(fileContent);
}

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Authorization: Bearer <token> formati majburiy
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token topilmadi yoki format noto'g'ri",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admins = await readAdmins();
    const admin = admins.find(
      (item) => item.id === decoded.id && item.username === decoded.username
    );

    // Token bor, lekin admin ro'yxatda bo'lmasa kirishni rad etamiz
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Token yaroqsiz: admin topilmadi",
      });
    }

    // Parol hashni javoblarda tarqatmaslik uchun olib tashlaymiz
    const { passwordHash, ...safeAdmin } = admin;
    req.admin = safeAdmin;

    return next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Token yaroqsiz yoki muddati tugagan",
    });
  }
}

// Ham default export, ham nomlangan export sifatida beramiz
module.exports = protect;
module.exports.protect = protect;
