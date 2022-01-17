const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    identifier: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: [
      {
        size: { type: Number, required: true },
        inStock: { type: Number, required: true },
      },
      {
        size: { type: Number, required: true },
        inStock: { type: Number, required: true },
      },
      {
        size: { type: Number, required: true },
        inStock: { type: Number, required: true },
      },
      {
        size: { type: Number, required: true },
        inStock: { type: Number, required: true },
      },
      {
        size: { type: Number, required: true },
        inStock: { type: Number, required: true },
      },
      {
        size: { type: Number, required: true },
        inStock: { type: Number, required: true },
      },
      {
        size: { type: Number, required: true },
        inStock: { type: Number, required: true },
      },
      {
        size: { type: Number, required: true },
        inStock: { type: Number, required: true },
      },
      {
        size: { type: Number, required: true },
        inStock: { type: Number, required: true },
      },
    ],
    image: { type: Array, required: true },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
