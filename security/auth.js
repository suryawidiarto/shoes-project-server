const jwt = require("jsonwebtoken");

exports.GenerateToken = (data) => {
  const token = jwt.sign(
    {
      _id: data.id,
      name: data.name,
      email: data.email,
      isAdmin: data.isAdmin,
    },
    process.env.SECRET_JWT_SALT,
    { expiresIn: "1h" }
  );

  return token;
};

exports.AuthenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const validated = jwt.verify(token, process.env.SECRET_JWT_SALT);
    req.user = validated;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authenticate Token Failed", error: error });
  }
};
