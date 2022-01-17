const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderedItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: { type: String, required: true },
        productDescription: { type: String, required: true },
        productSize: { type: Number, required: true },
        productPrice: { type: Number, required: true },
        productImage: { type: Array, required: true },
        productQty: { type: Number, required: true },
      },
    ],

    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      district: { type: String, required: true },
      sub_district: { type: String, required: true },
      province: { type: String, required: true },
      postal_code: { type: Number, required: true },
    },
    orderPrice: {
      product_price: { type: Number, required: true },
      shipping_price: { type: Number, required: true },
      total_price: { type: Number, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      isPaid: { type: Boolean, default: false },
      paidAt: { type: Date },
    },
    deliveredStatus: {
      isDelivered: { type: Boolean, default: false },
      deliveredAt: { type: Date },
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
