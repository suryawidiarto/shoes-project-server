const UserModel = require("../models/userModel");
const { GenerateToken } = require("../security/auth");
const { EncryptData, DecryptData } = require("../security/hash");

exports.userCheckToken = async (req, res, next) => {
  res.status(201).json({ message: "Token Valid" });
};

exports.userSignUp = async (req, res, next) => {
  try {
    const User = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: EncryptData(req.body.password),
      isAdmin: req.body.isAdmin,
      address: "",
      province: "",
      district: "",
      sub_district: "",
      postal_code: "",
    });

    const response = await User.save();
    res.status(201).json({ message: "SignUp Success", data: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

exports.userSignIn = async (req, res, next) => {
  try {
    const User = await UserModel.findOne({ email: req.body.email });
    if (User) {
      if (DecryptData(User.password) === req.body.password) {
        res.status(201).json({
          message: "SignIn Success",
          _id: User._id,
          isAdmin: User.isAdmin,
          token: GenerateToken(User),
        });
      } else {
        res.status(401).json({ message: "SignIn Failed", error: "Wrong Email / Password" });
      }
    } else {
      res.status(404).json({ message: "SignIn Failed", error: "User Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

exports.userGetProfile = async (req, res, next) => {
  try {
    const User = await UserModel.findById(req.user._id);
    if (User) {
      res.status(201).send({
        _id: User._id,
        name: User.name,
        email: User.email,
        address: User.address,
        province: User.province,
        district: User.district,
        sub_district: User.sub_district,
        postal_code: User.postal_code,
      });
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

exports.userUpdateProfile = async (req, res, next) => {
  try {
    const User = await UserModel.findById(req.user._id);
    if (User) {
      User.name = req.body.name || User.name;
      User.email = req.body.email || User.email;
      User.password = req.body.password ? EncryptData(req.body.password) : User.password;
      User.address = req.body.address || User.address;
      User.province = req.body.province || User.province;
      User.district = req.body.district || User.district;
      User.sub_district = req.body.sub_district || User.sub_district;
      User.postal_code = req.body.postal_code || User.postal_code;

      const UpdatedUser = await User.save();

      res.send({
        _id: UpdatedUser._id,
        name: UpdatedUser.name,
        email: UpdatedUser.email,
        address: UpdatedUser.address,
        province: UpdatedUser.province,
        district: UpdatedUser.district,
        sub_district: UpdatedUser.sub_district,
        postal_code: UpdatedUser.postal_code,
        token: GenerateToken(UpdatedUser),
      });
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

exports.userPostCartItem = async (req, res, next) => {
  try {
    const User = await UserModel.findById(req.user._id);
    User.cartItems = req.body.cartItems;
    const response = await User.save();
    res.status(201).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

exports.userGetCartItems = async (req, res, next) => {
  try {
    const User = await UserModel.findById(req.user._id);
    res.status(201).send(User.cartItems);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};
