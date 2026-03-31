# Fermer-Info — 1-bosqich

## Nega MongoDB tanlandi?

Ushbu loyiha uchun **MongoDB + Mongoose** tanlandi, sabablari:

1. Maqolalar (`Article`) va bozor narxlari (`MarketPrice`) strukturasida keyinchalik qo'shimcha maydonlar paydo bo'lishi ehtimoli yuqori.
2. Tez prototiplash va admin panel orqali kontentni dinamik boshqarish MongoDB bilan yengilroq.
3. Mongoose validatsiya va indekslar orqali backendda qat'iy nazoratni saqlab turadi.

## Folder Structure

```text
fermer-info/
  backend/
    src/
      config/
      controllers/
      middlewares/
      models/
        AdminUser.js
        Article.js
        MarketPrice.js
      routes/
      utils/
    uploads/
  frontend/
    public/
    src/
  STAGE-1.md
```

## Yaratilgan Schema fayllari

- `backend/src/models/AdminUser.js`
- `backend/src/models/Article.js`
- `backend/src/models/MarketPrice.js`

Keyingi bosqichda shu modellar asosida Express server va JWT login API yoziladi.
