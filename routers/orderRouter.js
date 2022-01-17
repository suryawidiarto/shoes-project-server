const express = require("express");
const {
  orderGetAllData,
  orderGetDataByIdOrder,
  orderPostData,
  orderGetDataByIdUser,
  orderPostPayment,
  orderPostDelivered,
  orderDeleteData,
} = require("../controllers/orderControllers");
const { AuthenticateToken } = require("../security/auth");

const orderRouter = express.Router();

orderRouter.get("/admin", AuthenticateToken, orderGetAllData);
orderRouter.get("/order/:orderId", AuthenticateToken, orderGetDataByIdOrder);
orderRouter.post("/ordered", AuthenticateToken, orderGetDataByIdUser);
orderRouter.post("/add-order", AuthenticateToken, orderPostData);
orderRouter.post("/payment", AuthenticateToken, orderPostPayment);
orderRouter.post("/delivered", AuthenticateToken, orderPostDelivered);
orderRouter.delete("/delete-order/:orderId", AuthenticateToken, orderDeleteData);

module.exports = orderRouter;
