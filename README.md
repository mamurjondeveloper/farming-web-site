# 🚜 Fermer-Info: Zamonaviy Qishloq Xo'jaligi Platformasi

**Fermer-Info** — bu O'zbekiston fermerlari uchun qishloq xo'jaligi mahsulotlarining joriy narxlarini kuzatib borish, sohadagi yangiliklar bilan tanishish va bozor dinamikasini tahlil qilish uchun yaratilgan innovatsion platforma.

---

## 🌟 Asosiy Imkoniyatlar (Features)

- **📈 Birja Ticker (Yuguruvchi qator):** Bozorlardagi o'rtacha narxlarni real vaqt rejimida kuzatish.
- **📊 Interaktiv Grafiklar (Trading Charts):** Har bir mahsulot narxining o'zgarish tarixini Recharts grafiklarida tahlil qilish.
- **📰 Maqolalar va Yangiliklar:** Sohadagi eng so'nggi yangiliklar va foydali qo'llanmalar.
- **🛡️ Kuchli Admin Panel:** Mahsulotlarni boshqarish, ko'rinishni sozlash (Eye-Toggle) va narxlar tarixini (History Table) nazorat qilish.
- **🔒 Xavfsiz Shaxsiy Kabinet:** Profilni tahrirlash va xavfsiz Login/Register tizimi.

---

## 🚀 Texnologiyalar (Tech Stack)

### Frontend:
- **React.js** (Vite orqali)
- **TailwindCSS** (Premium UI dizayn)
- **Recharts** (Professional trading grafiklari)
- **Axios** (Backend bilan bog'lanish)

### Backend:
- **Node.js & Express**
- **SQLite** (Ma'lumotlar bazasi - `baza.db`)
- **JWT** (Xavfsiz autentifikatsiya)
- **Express-FileUpload** (Rasm yuklash tizimi)

---

## 🛠️ O'rnatish va Ishga Tushirish (Installation)

Loyihani o'z kompyuteringizda ishga tushirish uchun quyidagi qadamlarni bajaring:

### 1. Loyihani yuklab olish (Clone)
```bash
git clone https://github.com/mamurjondeveloper/farming-web-site.git
cd farming-web-site
```

### 2. Backendni sozlash
```bash
cd backend
npm install
# Serverni ishga tushirish
npm start
```
*Backend `http://localhost:5000` portida ishlaydi.*

### 3. Frontendni sozlash
Yangi terminalda:
```bash
cd frontend
npm install
# Saytni ishga tushirish
npm run dev
```
*Frontend `http://localhost:5173` portida ochiladi.*

---

## 📁 Ma'lumotlar Bazasi (Database)
Loyiha **SQLite** orqali ishlaydi, shuning uchun qo'shimcha PostgreSQL yoki MySQL o'rnatish shart emas. Birinchi marta ishga tushganda `baza.db` fayli avtomat yaratiladi va jadvallar shakllanadi.

---

## 🔐 Admin Ma'lumotlari
Admin paneliga kirish uchun quyidagi ma'lumotlardan foydalaning (Test rejimida):
- **Username:** `admin2026`
- **Password:** `Fermer123!@#`

---

## 📝 Muallif
Ushbu loyiha muallifi: **Mamurjon Developer** 👨‍💻

--- 
*2026 yil o'quv yili uchun maxsus ishlab chiqilgan.*
