const crypto = require("crypto");
const { getQuery, allQuery, runQuery } = require("../config/db");

exports.getAllPrices = async (_req, res, next) => {
  try {
    const prices = await allQuery("SELECT * FROM prices ORDER BY createdAt DESC");
    return res.status(200).json({ success: true, count: prices.length, data: prices });
  } catch (error) {
    return next(error);
  }
};

exports.getPriceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const price = await getQuery("SELECT * FROM prices WHERE id = ?", [id]);

    if (!price) {
      return res.status(404).json({ success: false, message: "Narx yozuvi topilmadi" });
    }

    return res.status(200).json({ success: true, data: price });
  } catch (error) {
    return next(error);
  }
};

exports.createPrice = async (req, res, next) => {
  try {
    const { region, district = "", productName, unit = "kg", priceMin, priceMax, currency = "UZS", marketName = "", priceDate } = req.body;

    if (!region || !productName || priceMin === undefined || priceMax === undefined || !priceDate) {
      return res.status(400).json({ success: false, message: "region, productName, priceMin, priceMax, priceDate maydonlari majburiy" });
    }

    if (Number(priceMin) > Number(priceMax)) {
      return res.status(400).json({ success: false, message: "priceMin priceMax dan katta bo'lishi mumkin emas" });
    }

    const now = new Date().toISOString();
    const newPrice = {
      id: crypto.randomUUID(),
      region: String(region).trim(),
      district: String(district || "").trim(),
      productName: String(productName).trim(),
      unit: String(unit).trim(),
      priceMin: Number(priceMin),
      priceMax: Number(priceMax),
      currency: String(currency).trim(),
      marketName: String(marketName || "").trim(),
      priceDate: new Date(priceDate).toISOString(),
      createdAt: now,
      updatedAt: now,
      createdBy: req.admin?.username || "admin",
      updatedBy: req.admin?.username || "admin",
    };

    await runQuery(`INSERT INTO prices (id, region, district, productName, unit, priceMin, priceMax, currency, marketName, priceDate, createdAt, updatedAt, createdBy, updatedBy) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [newPrice.id, newPrice.region, newPrice.district, newPrice.productName, newPrice.unit, newPrice.priceMin, newPrice.priceMax, newPrice.currency, newPrice.marketName, newPrice.priceDate, newPrice.createdAt, newPrice.updatedAt, newPrice.createdBy, newPrice.updatedBy]
    );

    return res.status(201).json({ success: true, message: "Narx yozuvi yaratildi", data: newPrice });
  } catch (error) {
    return next(error);
  }
};

exports.updatePrice = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const currentPrice = await getQuery("SELECT * FROM prices WHERE id = ?", [id]);
    if (!currentPrice) {
      return res.status(404).json({ success: false, message: "Narx yozuvi topilmadi" });
    }

    const updatedPrice = {
      ...currentPrice,
      region: req.body.region !== undefined ? String(req.body.region).trim() : currentPrice.region,
      district: req.body.district !== undefined ? String(req.body.district).trim() : currentPrice.district,
      productName: req.body.productName !== undefined ? String(req.body.productName).trim() : currentPrice.productName,
      unit: req.body.unit !== undefined ? String(req.body.unit).trim() : currentPrice.unit,
      priceMin: req.body.priceMin !== undefined && Number.isFinite(Number(req.body.priceMin)) ? Number(req.body.priceMin) : currentPrice.priceMin,
      priceMax: req.body.priceMax !== undefined && Number.isFinite(Number(req.body.priceMax)) ? Number(req.body.priceMax) : currentPrice.priceMax,
      currency: req.body.currency !== undefined ? String(req.body.currency).trim() : currentPrice.currency,
      marketName: req.body.marketName !== undefined ? String(req.body.marketName).trim() : currentPrice.marketName,
      priceDate: req.body.priceDate !== undefined ? new Date(req.body.priceDate).toISOString() : currentPrice.priceDate,
      updatedAt: new Date().toISOString(),
      updatedBy: req.admin?.username || currentPrice.updatedBy,
    };

    if (updatedPrice.priceMin > updatedPrice.priceMax) {
      return res.status(400).json({ success: false, message: "priceMin priceMax dan katta bo'lishi mumkin emas" });
    }

    await runQuery(`UPDATE prices SET region=?, district=?, productName=?, unit=?, priceMin=?, priceMax=?, currency=?, marketName=?, priceDate=?, updatedAt=?, updatedBy=? WHERE id=?`, 
      [updatedPrice.region, updatedPrice.district, updatedPrice.productName, updatedPrice.unit, updatedPrice.priceMin, updatedPrice.priceMax, updatedPrice.currency, updatedPrice.marketName, updatedPrice.priceDate, updatedPrice.updatedAt, updatedPrice.updatedBy, id]
    );

    return res.status(200).json({ success: true, message: "Narx yozuvi yangilandi", data: updatedPrice });
  } catch (error) {
    return next(error);
  }
};

exports.deletePrice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentPrice = await getQuery("SELECT id FROM prices WHERE id = ?", [id]);

    if (!currentPrice) {
      return res.status(404).json({ success: false, message: "Narx yozuvi topilmadi" });
    }

    await runQuery("DELETE FROM prices WHERE id = ?", [id]);

    return res.status(200).json({ success: true, message: "Narx yozuvi o'chirildi" });
  } catch (error) {
    return next(error);
  }
};
