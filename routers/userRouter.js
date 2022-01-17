const express = require("express");
const multer = require("multer");
const {
  userSignIn,
  userSignUp,
  userGetProfile,
  userUpdateProfile,
  userPostCartItem,
  userGetCartItems,
  userCheckToken,
} = require("../controllers/userControllers");
const { AuthenticateToken } = require("../security/auth");

const userRouter = express.Router();

userRouter.get("/check-token", AuthenticateToken, userCheckToken);
userRouter.get("/profile", AuthenticateToken, userGetProfile);
userRouter.get("/cart", AuthenticateToken, userGetCartItems);
userRouter.post("/item-cart", AuthenticateToken, userPostCartItem);
userRouter.post("/signin", userSignIn);
userRouter.post("/add-user", userSignUp);
userRouter.post("/update-profile", AuthenticateToken, userUpdateProfile);

module.exports = userRouter;
