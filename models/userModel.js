const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    province: { type: String },
    district: { type: String },
    sub_district: { type: String },
    postal_code: { type: String },
    isAdmin: { type: Boolean, default: false },
    cartItems: { type: Array },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
