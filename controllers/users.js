const models = require("../models");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  const { email, password, name } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await models.User.create({
    email,
    password: hashPassword,
    name,
  });
  res.status(201).json({ message: "ok", data: user });
};

const findAll = async (req, res) => {
  const users = await models.User.findAll();
  res.status(200).json({ message: "ok", data: users });
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { password, name } = req.body;
  const user = await models.User.findByPk(id);
  if (user) {
    if (password) user.password = password;
    if (name) user.name = name;
    await user.save();
    res.status(200).json({ message: "ok", data: user });
  } else {
    res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const result = await models.User.destroy({ where: { id: id } });
  if (result) {
    res.status(200).json({ message: "ok" });
  } else {
    res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });
  }
};

const findUserByEmail = async (req, res) => {
  const user = await models.User.findOne({ where: { email: email } });
  return user;
};

module.exports = {
  createUser,
  findAll,
  updateUser,
  deleteUser,
  findUserByEmail,
};
