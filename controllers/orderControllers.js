const OrderModel = require("../models/orderModel");
const ProductModel = require("../models/productModel");

exports.orderGetAllData = async (req, res, next) => {
  try {
    const order = await OrderModel.find();
    res.status(201).send(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

exports.orderDeleteData = async (req, res, next) => {
  try {
    const response = await OrderModel.deleteOne({ _id: req.params.orderId });
    res.status(201).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

exports.orderGetDataByIdOrder = async (req, res, next) => {
  try {
    const order = await OrderModel.findOne({ _id: req.params.orderId });
    res.status(201).send(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

exports.orderGetDataByIdUser = async (req, res, next) => {
  try {
    const order = await OrderModel.find({ userId: req.body.userId });
    res.status(201).send(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

exports.orderPostData = async (req, res, next) => {
  try {
    const order = new OrderModel({
      userId: req.body.userId,
      orderedItems: req.body.orderedItems,
      shippingAddress: req.body.shippingAddress,
      orderPrice: req.body.orderPrice,
      paymentMethod: req.body.paymentMethod,
    });

    const orderedItems = req.body.orderedItems;
    orderedItems.forEach(async (item) => {
      const product = await ProductModel.findById(item.productId);
      const productIndexStock = product.stock.findIndex((e) => e.size == item.productSize);
      const productStock = product.stock[productIndexStock].inStock;
      const productStockCheck = productStock - item.productQty;
      product.stock[productIndexStock].inStock = productStockCheck;
      product.save();
    });

    const newOrder = await order.save();
    res.status(201).send(newOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

exports.orderPostPayment = async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.body.orderId);
    order.paymentStatus = {
      isPaid: req.body.isPaid,
      paidAt: req.body.paidAt,
    };

    const newOrder = await order.save();
    res.status(201).send(newOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

exports.orderPostDelivered = async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.body.orderId);
    order.deliveredStatus = {
      isDelivered: req.body.isDelivered,
      deliveredAt: req.body.deliveredAt,
    };

    const newOrder = await order.save();
    res.status(201).send(newOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};
