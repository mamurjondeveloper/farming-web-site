const crypto = require("crypto");
const { getQuery, runQuery, allQuery } = require("../config/db");

// Barcha Ticker ob'ektlarini eng so'nggi tarixi bilan qaytaradi (Frontend uchun public/admin)
exports.getTickers = async (req, res, next) => {
  try {
    const isAdmin = req.admin ? true : false;
    
    // Asosiy ob'ektlar
    let items;
    if (isAdmin) {
       items = await allQuery("SELECT * FROM ticker_items ORDER BY orderIndex ASC, createdAt DESC");
    } else {
       items = await allQuery("SELECT * FROM ticker_items WHERE isVisible = 1 ORDER BY orderIndex ASC, createdAt DESC");
    }

    // Har biriga eng so'nggi narx tarixini bog'lash
    const populatedItems = await Promise.all(items.map(async (item) => {
      const history = await allQuery("SELECT * FROM ticker_history WHERE tickerItemId = ? ORDER BY createdAt DESC", [item.id]);
      const latestPrice = history.length > 0 ? history[0] : null;
      
      return {
        id: item.id,
        productName: item.productName,
        isVisible: item.isVisible,
        orderIndex: item.orderIndex,
        price: latestPrice ? latestPrice.price : null,
        currency: latestPrice ? latestPrice.currency : 'UZS',
        history: history // Chart va table uchun
      };
    }));

    return res.status(200).json({ success: true, data: populatedItems });
  } catch (err) {
    return next(err);
  }
};

// Yangi Ticker obyekti qoshadi va dastlabki narxni kiritadi
exports.createTickerItem = async (req, res, next) => {
  try {
    const { productName, price, currency } = req.body;
    if (!productName || !price) {
      return res.status(400).json({ success: false, message: "Kiritish maydonlari to'ldirilmagan" });
    }

    const itemId = crypto.randomUUID();
    const createdBy = req.admin.username;
    
    await runQuery(
      "INSERT INTO ticker_items (id, productName, isVisible, orderIndex, createdAt, createdBy) VALUES (?, ?, ?, ?, ?, ?)",
      [itemId, productName, 1, 0, new Date().toISOString(), createdBy]
    );

    const historyId = crypto.randomUUID();
    await runQuery(
      "INSERT INTO ticker_history (id, tickerItemId, price, currency, createdAt, createdBy) VALUES (?, ?, ?, ?, ?, ?)",
      [historyId, itemId, price, currency || 'UZS', new Date().toISOString(), createdBy]
    );

    return res.status(201).json({ success: true, message: "Yangi obyekt ro'yxatga olindi" });
  } catch (err) {
    return next(err);
  }
};

// Eski tahrirlash (update) o'rniga faqat ko'rinish holatini o'zgartirish (Ko'zcha / Toggle)
exports.toggleTickerVisibility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await getQuery("SELECT isVisible FROM ticker_items WHERE id = ?", [id]);
    if (!item) return res.status(404).json({ success: false, message: "Obyekt topilmadi" });

    const newVisibility = item.isVisible === 1 ? 0 : 1;
    await runQuery("UPDATE ticker_items SET isVisible = ? WHERE id = ?", [newVisibility, id]);

    return res.status(200).json({ success: true, message: "Ko'rinish holati o'zgardi", isVisible: newVisibility });
  } catch (err) {
    return next(err);
  }
};

// Ayrim obyektga yangi narx (history) qatorini qo'shish
exports.addTickerHistory = async (req, res, next) => {
  try {
    const { id } = req.params; // ticker_items id
    const { price, currency } = req.body;
    
    if (!price) {
       return res.status(400).json({ success: false, message: "Narxni kiriting" });
    }

    const item = await getQuery("SELECT id FROM ticker_items WHERE id = ?", [id]);
    if (!item) return res.status(404).json({ success: false, message: "Obyekt topilmadi" });

    const historyId = crypto.randomUUID();
    const createdBy = req.admin.username;

    await runQuery(
      "INSERT INTO ticker_history (id, tickerItemId, price, currency, createdAt, createdBy) VALUES (?, ?, ?, ?, ?, ?)",
      [historyId, id, price, currency || 'UZS', new Date().toISOString(), createdBy]
    );

    return res.status(201).json({ success: true, message: "Yangi narx tarixga yozildi" });
  } catch (err) {
    return next(err);
  }
};

// Xato yozilgan aniq bitta tarixiy narxni o'chirish
exports.deleteTickerHistory = async (req, res, next) => {
  try {
    const { historyId } = req.params;
    await runQuery("DELETE FROM ticker_history WHERE id = ?", [historyId]);
    return res.status(200).json({ success: true, message: "Bu narx tarixi o'chirildi" });
  } catch (err) {
    return next(err);
  }
};

// Ticker obyektini to'liq o'chirish (o'zining tarixi bilan qoshilib o'chadi)
exports.deleteTickerItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await runQuery("DELETE FROM ticker_items WHERE id = ?", [id]);
    await runQuery("DELETE FROM ticker_history WHERE tickerItemId = ?", [id]);

    res.status(200).json({ success: true, message: "Obyekt to'liq o'chirildi" });
  } catch (err) {
    return next(err);
  }
};
