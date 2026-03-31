const jwt = require("jsonwebtoken");
const { getQuery } = require("../config/db");

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

    const admin = await getQuery("SELECT id, username, email, role FROM admins WHERE id = ?", [decoded.id]);

    // Token bor, lekin admin ro'yxatda bo'lmasa kirishni rad etamiz
    if (!admin || admin.username !== decoded.username) {
      return res.status(401).json({
        success: false,
        message: "Token yaroqsiz: admin topilmadi",
      });
    }

    req.admin = admin;

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
