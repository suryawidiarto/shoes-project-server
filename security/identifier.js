exports.GenerateIdentifier = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomIdentifier = "";
  for (let i = 0; i < length; i++) {
    randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    randomIdentifier = randomIdentifier + randomChar;
  }
  return randomIdentifier;
};
