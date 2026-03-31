const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Maqola sarlavhasi majburiy"],
      trim: true,
      minlength: 5,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: [true, "Slug majburiy"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    summary: {
      type: String,
      required: [true, "Qisqa izoh majburiy"],
      trim: true,
      maxlength: 400,
    },
    content: {
      type: String,
      required: [true, "Maqola matni majburiy"],
    },
    category: {
      type: String,
      required: true,
      enum: ["dehqonchilik", "chorvachilik", "kasalliklar", "agrotexnika", "boshqa"],
      index: true,
    },
    // Admin panel orqali yuklangan rasm URL manzili
    coverImage: {
      type: String,
      default: "",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

articleSchema.index({ category: 1, publishedAt: -1 });
articleSchema.index({ title: "text", summary: "text", content: "text", tags: "text" });

module.exports = mongoose.model("Article", articleSchema);
