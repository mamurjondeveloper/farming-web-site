const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminUserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Admin ism-familiyasi majburiy"],
      trim: true,
      maxlength: 120,
    },
    username: {
      type: String,
      required: [true, "Username majburiy"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 4,
      maxlength: 40,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Parol hash qiymati majburiy"],
      minlength: 20,
      select: false,
    },
    role: {
      type: String,
      enum: ["superadmin", "editor"],
      default: "editor",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

adminUserSchema.methods.comparePassword = async function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

module.exports = mongoose.model("AdminUser", adminUserSchema);
