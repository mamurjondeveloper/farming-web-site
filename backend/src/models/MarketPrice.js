const mongoose = require("mongoose");

const marketPriceSchema = new mongoose.Schema(
  {
    region: {
      type: String,
      required: [true, "Viloyat nomi majburiy"],
      trim: true,
      index: true,
    },
    district: {
      type: String,
      default: "",
      trim: true,
    },
    productName: {
      type: String,
      required: [true, "Mahsulot nomi majburiy"],
      trim: true,
      index: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "dona", "litr", "qop", "tonna"],
      default: "kg",
    },
    priceMin: {
      type: Number,
      required: true,
      min: [0, "Narx manfiy bo'lishi mumkin emas"],
    },
    priceMax: {
      type: Number,
      required: true,
      min: [0, "Narx manfiy bo'lishi mumkin emas"],
    },
    currency: {
      type: String,
      enum: ["UZS", "USD"],
      default: "UZS",
    },
    marketName: {
      type: String,
      default: "",
      trim: true,
    },
    // Qaysi kun uchun narx kiritilgani
    priceDate: {
      type: Date,
      required: true,
      index: true,
    },
    sourceNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
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

marketPriceSchema.pre("validate", function validateMinMax(next) {
  if (this.priceMin > this.priceMax) {
    return next(new Error("priceMin priceMax dan katta bo'lishi mumkin emas"));
  }
  return next();
});

// Bir mahsulot uchun bir hududda bir kunga bitta yozuv saqlaymiz
marketPriceSchema.index(
  { region: 1, district: 1, productName: 1, priceDate: 1, marketName: 1 },
  { unique: true }
);

module.exports = mongoose.model("MarketPrice", marketPriceSchema);
