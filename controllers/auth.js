const models = require("../models");
const bcrypt = require("bcryptjs");
const { generateAccessToken } = require("../utils/token");

const register = async (req, res) => {
  const { email, password, name } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await models.User.create({
    email,
    password: hashPassword,
    name,
  });
  res.status(201).json({ message: "ok", data: user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await models.User.findOne({
    where: { email: email },
  });
  if (!user) {
    return res
      .status(400)
      .json({ message: "유효하지 않은 이메일과 비밀번호입니다." });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ message: "유효하지 않은 이메일과 비밀번호입니다." });
  }
  const accessToken = generateAccessToken(user);
  res.json({ message: "ok", accessToken: accessToken, user });
};

module.exports = {
  register,
  login,
};
