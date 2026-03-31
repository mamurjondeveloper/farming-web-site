const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Uploads papkasini yaratish agar yo'q bo'lsa
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Fayl nomini unikallash uchun vaqt va random qiymat
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Faqat rasmlarga ruxsat berish
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error("Faqat rasm fayllari (JPEG, PNG, GIF) yuklanishi mumkin!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Rasm yuklanmadi" });
  }

  // Frontend shunday silkaga murojaat qilishi uchun qaytaramiz
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ success: true, url: fileUrl });
});

module.exports = router;
