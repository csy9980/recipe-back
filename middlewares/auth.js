const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "인증된 사용자가 아닙니다." });
  }

  jwt.verify(token, "access_token", (err, user) => {
    if (err) {
      return res.status(401).json({ message: "인증된 사용자가 아닙니다." });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticate,
};
