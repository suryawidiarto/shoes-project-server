const CryptoJS = require("crypto-js");

exports.EncryptData = (data) => {
  const encrypted = CryptoJS.AES.encrypt(data, process.env.SECRET_ENCRYPT_SALT).toString();
  return encrypted;
};

exports.DecryptData = (data) => {
  const decrypted = CryptoJS.AES.decrypt(data, process.env.SECRET_ENCRYPT_SALT).toString(
    CryptoJS.enc.Utf8
  );
  return decrypted;
};
