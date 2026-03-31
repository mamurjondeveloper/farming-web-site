const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const { initDB } = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const articleRoutes = require("./src/routes/articleRoutes");
const priceRoutes = require("./src/routes/priceRoutes");
const tickerRoutes = require("./src/routes/tickerRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");

// .env fayldagi sozlamalarni yuklab olamiz
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// JSON body o'qish va CORS uchun global middlewarelar
app.use(cors());
app.use(express.json());

// Statik fayllarni (uploads) xizmat qilish
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Sog'liqni tekshirish uchun oddiy endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Fermer-Info API ishlayapti" });
});

// App marshrutlari
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/ticker", tickerRoutes);
app.use("/api/upload", uploadRoutes);

// Noma'lum marshrutlar uchun javob
app.use((req, res) => {
  res.status(404).json({ success: false, message: `${req.originalUrl} topilmadi` });
});

// Global xatoliklarni ushlash
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.message === "Faqat rasm fayllari (JPEG, PNG, GIF) yuklanishi mumkin!") {
     return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: "Server ichki xatoligi" });
});

// Baza ishga tushirilib, server yoqiladi
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishga tushdi va Baza jadvallari faol`);
  });
});
