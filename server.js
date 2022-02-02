require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const orderRouter = require("./routers/orderRouter");
const productRouter = require("./routers/productRouter");
const userRouter = require("./routers/userRouter");

const port = process.env.PORT || 80;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/sp-api-users", userRouter);
app.use("/sp-api-products", productRouter);
app.use("/sp-api-orders", orderRouter);

app.get("/", (req, res) => {
  res.status(201).json({ message: "SERVER ONLINE" });
});

const retryConnect = () => {
  mongoose
    .connect(`${process.env.MONGODB_URL}`)
    .then(() => {
      app.listen(port, () => {
        console.log(`Server Connection Success || Running Succesfully || CORS Enabled`);
      });
    })
    .catch((err) => {
      console.log(err);
      setTimeout(retryConnect, 10000);
    });
};

retryConnect();
