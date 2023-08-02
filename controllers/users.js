const User = require("../models/user");
const bcrypt = require('bcryptjs');

function login(req, res) {
  const {email, password} = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', {expiresIn: '7d'})
      })
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
}

function getMe(req, res) {
  User.findById(req.user._id)
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err.name === "CastError") {
      return res.status(400).send({ message: "Некорректный ID" });
    }
    return res.status(500).send({ message: `Произошла ошибка ${err}` });
  });
}

function getUsers(req, res) {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
}

function getUserById(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Некорректный ID" });
      }
      return res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      email: req.body.email,
      password: hash,
      name,
      about,
      avatar
    }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Переданы некорректные данные" });
      }
      return res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
}

function updateUser(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Переданы некорректные данные" });
      }
      return res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Переданы некорректные данные" });
      }

      return res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
}

module.exports = {
  login,
  getMe,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar
};
