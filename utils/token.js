const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    "access_token",
    { expiresIn: "30d" }
  );
};

module.exports = {
  generateAccessToken,
};
