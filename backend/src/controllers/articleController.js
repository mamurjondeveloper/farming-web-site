const crypto = require("crypto");
const { getQuery, allQuery, runQuery } = require("../config/db");

exports.getAllArticles = async (_req, res, next) => {
  try {
    const articles = await allQuery("SELECT * FROM articles ORDER BY createdAt DESC");
    // Parse tags back to array
    const formattedArticles = articles.map(a => ({
       ...a,
       tags: JSON.parse(a.tags || "[]")
    }));
    return res.status(200).json({ success: true, count: formattedArticles.length, data: formattedArticles });
  } catch (error) {
    return next(error);
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await getQuery("SELECT * FROM articles WHERE id = ?", [id]);

    if (!article) {
      return res.status(404).json({ success: false, message: "Maqola topilmadi" });
    }

    article.tags = JSON.parse(article.tags || "[]");
    return res.status(200).json({ success: true, data: article });
  } catch (error) {
    return next(error);
  }
};

exports.createArticle = async (req, res, next) => {
  try {
    const { title, summary, content, category, coverImage = "", tags = [] } = req.body;

    if (!title || !summary || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "title, summary, content, category maydonlari majburiy",
      });
    }

    const now = new Date().toISOString();
    const newArticle = {
      id: crypto.randomUUID(),
      title: String(title).trim(),
      summary: String(summary).trim(),
      content: String(content).trim(),
      category: String(category).trim(),
      coverImage: String(coverImage || "").trim(),
      tags: Array.isArray(tags) ? tags : [],
      viewsCount: 0,
      createdAt: now,
      updatedAt: now,
      createdBy: req.admin?.username || "admin",
      updatedBy: req.admin?.username || "admin",
    };

    await runQuery(`INSERT INTO articles (id, title, summary, content, category, coverImage, tags, viewsCount, createdAt, updatedAt, createdBy, updatedBy) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [newArticle.id, newArticle.title, newArticle.summary, newArticle.content, newArticle.category, newArticle.coverImage, JSON.stringify(newArticle.tags), newArticle.viewsCount, newArticle.createdAt, newArticle.updatedAt, newArticle.createdBy, newArticle.updatedBy]
    );

    return res.status(201).json({ success: true, message: "Maqola yaratildi", data: newArticle });
  } catch (error) {
    return next(error);
  }
};

exports.updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, summary, content, category, coverImage, tags, viewsCount } = req.body;

    const currentArticle = await getQuery("SELECT * FROM articles WHERE id = ?", [id]);
    if (!currentArticle) {
      return res.status(404).json({ success: false, message: "Maqola topilmadi" });
    }

    const updatedArticle = {
      ...currentArticle,
      title: title !== undefined ? String(title).trim() : currentArticle.title,
      summary: summary !== undefined ? String(summary).trim() : currentArticle.summary,
      content: content !== undefined ? String(content).trim() : currentArticle.content,
      category: category !== undefined ? String(category).trim() : currentArticle.category,
      coverImage: coverImage !== undefined ? String(coverImage).trim() : currentArticle.coverImage,
      tags: tags !== undefined ? (Array.isArray(tags) ? tags : JSON.parse(currentArticle.tags)) : JSON.parse(currentArticle.tags),
      viewsCount: viewsCount !== undefined && Number.isFinite(Number(viewsCount)) ? Number(viewsCount) : currentArticle.viewsCount,
      updatedAt: new Date().toISOString(),
      updatedBy: req.admin?.username || currentArticle.updatedBy,
    };

    await runQuery(`UPDATE articles SET title=?, summary=?, content=?, category=?, coverImage=?, tags=?, viewsCount=?, updatedAt=?, updatedBy=? WHERE id=?`, 
      [updatedArticle.title, updatedArticle.summary, updatedArticle.content, updatedArticle.category, updatedArticle.coverImage, JSON.stringify(updatedArticle.tags), updatedArticle.viewsCount, updatedArticle.updatedAt, updatedArticle.updatedBy, id]
    );

    return res.status(200).json({ success: true, message: "Maqola yangilandi", data: updatedArticle });
  } catch (error) {
    return next(error);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentArticle = await getQuery("SELECT id FROM articles WHERE id = ?", [id]);

    if (!currentArticle) {
      return res.status(404).json({ success: false, message: "Maqola topilmadi" });
    }

    await runQuery("DELETE FROM articles WHERE id = ?", [id]);

    return res.status(200).json({ success: true, message: "Maqola o'chirildi" });
  } catch (error) {
    return next(error);
  }
};

