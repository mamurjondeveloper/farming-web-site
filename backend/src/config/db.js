const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs/promises');

const dbPath = path.join(__dirname, '..', 'data', 'baza.db');

// Connect to SQLite DB
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Baza ulanishida xatolik:', err.message);
  } else {
    console.log('SQLite bazasiga muvaffaqiyatli ulandi.');
  }
});

// Helper for running async queries
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      resolve(this);
    });
  });
};

const getQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const allQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

// Initialize tables
const initDB = async () => {
  try {
    // 1. Admins Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        role TEXT DEFAULT 'editor'
      )
    `);

    // 2. Articles Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT,
        content TEXT,
        category TEXT,
        coverImage TEXT,
        tags TEXT, -- JSON saqlanadi string qilib
        viewsCount INTEGER DEFAULT 0,
        createdAt TEXT,
        updatedAt TEXT,
        createdBy TEXT,
        updatedBy TEXT
      )
    `);

    // 3. Prices Table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS prices (
        id TEXT PRIMARY KEY,
        region TEXT NOT NULL,
        district TEXT,
        productName TEXT NOT NULL,
        unit TEXT,
        priceMin INTEGER,
        priceMax INTEGER,
        currency TEXT,
        marketName TEXT,
        priceDate TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        createdBy TEXT,
        updatedBy TEXT
      )
    `);

    // Migrate existing JSON datalarni faqat birinchi marta kiritamiz
    await migrateData();

    console.log("Ma'lumotlar bazasi tayyor!");
  } catch (error) {
    console.error("Bazani yaratishda xato:", error);
  }
};

const migrateData = async () => {
  try {
    const adminCount = await getQuery("SELECT COUNT(*) AS count FROM admins");
    if (adminCount.count === 0) {
      const adminPath = path.join(__dirname, '..', 'data', 'admins.json');
      const adminData = JSON.parse(await fs.readFile(adminPath, 'utf-8'));
      for (const admin of adminData) {
        await runQuery("INSERT INTO admins (id, username, passwordHash, role) VALUES (?, ?, ?, ?)", 
        [admin.id, admin.username, admin.passwordHash, admin.role]);
      }
      console.log("Adminlar ko'chirildi");
    }

    const articleCount = await getQuery("SELECT COUNT(*) AS count FROM articles");
    if (articleCount.count === 0) {
      const articlePath = path.join(__dirname, '..', 'data', 'articles.json');
      try {
        const articleData = JSON.parse(await fs.readFile(articlePath, 'utf-8'));
        for (const art of articleData) {
          await runQuery(`INSERT INTO articles (id, title, summary, content, category, coverImage, tags, viewsCount, createdAt, updatedAt, createdBy, updatedBy) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
          [art.id, art.title, art.summary, art.content, art.category, art.coverImage, JSON.stringify(art.tags || []), art.viewsCount, art.createdAt, art.updatedAt, art.createdBy, art.updatedBy]);
        }
        console.log("Maqolalar ko'chirildi");
      } catch(e) {}
    }

    const priceCount = await getQuery("SELECT COUNT(*) AS count FROM prices");
    if (priceCount.count === 0) {
      const pricePath = path.join(__dirname, '..', 'data', 'prices.json');
      try {
         const priceData = JSON.parse(await fs.readFile(pricePath, 'utf-8'));
         for (const pr of priceData) {
            await runQuery(`INSERT INTO prices (id, region, district, productName, unit, priceMin, priceMax, currency, marketName, priceDate, createdAt, updatedAt, createdBy, updatedBy) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [pr.id, pr.region, pr.district, pr.productName, pr.unit, pr.priceMin, pr.priceMax, pr.currency, pr.marketName, pr.priceDate, pr.createdAt, pr.updatedAt, pr.createdBy, pr.updatedBy]);
         }
         console.log("Narxlar ko'chirildi");
      } catch(e) {}
    }
  } catch(error) {
     console.error("Migratsiyada xato:", error);
  }
};

module.exports = {
  db,
  initDB,
  runQuery,
  getQuery,
  allQuery
};
