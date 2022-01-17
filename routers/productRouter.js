const express = require("express");
const multer = require("multer");
const {
  productGetAllData,
  productGetDataById,
  productPostData,
  productDeleteData,
  productGetImage,
  productUserGetAllData,
  productEditData,
} = require("../controllers/productControllers");
const { AuthenticateToken } = require("../security/auth");

const productRouter = express.Router();
const upload = multer({ dest: "uploads/" });

productRouter.get("/admin", AuthenticateToken, productGetAllData);
productRouter.get("/user", productUserGetAllData);
productRouter.get("/product/:productId", productGetDataById);
productRouter.get("/product-img/:identifierKey/:imageKey", productGetImage);
productRouter.post(
  "/add-product",
  AuthenticateToken,
  upload.fields([{ name: "image" }]),
  productPostData
);
productRouter.post(
  "/edit-product/:productId",
  AuthenticateToken,
  upload.fields([{ name: "image" }]),
  productEditData
);
productRouter.delete("/delete-product/:productId", AuthenticateToken, productDeleteData);

module.exports = productRouter;
