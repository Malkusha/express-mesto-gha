const User = require("../models/user");
const bcrypt = require("bcryptjs");

const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  ServerError
} = require("../errors/index");

function getUsers(req, res) {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      return next(new ServerError(`Произошла ошибка: ${err}`))
    });
}

function getUserById(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError('Некорректный ID'));
      }
      return next(new ServerError(`Произошла ошибка: ${err}`))
    });
}

function createUser(req, res) {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, about, avatar, email, password: hash })
    })
    .then((user) => res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar
    }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        return next(new ConflictError('Пользователь с такой почтой уже существует'))
      }
      return next(new ServerError(`Произошла ошибка: ${err}`))
    });
}

function updateUser(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(new ServerError(`Произошла ошибка: ${err}`))
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(new ServerError(`Произошла ошибка: ${err}`))
    });
}

function login(req, res) {
  const {email, password} = req.body;
  User.findOne({email}).select(+password)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', {expiresIn: '7d'})
      })
    })
    .catch((err) => {
      return next(new ServerError(`Произошла ошибка: ${err}`))
    })
}

function getCurrentUser(req, res) {
  User.findById(req.user._id)
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err.name === "CastError") {
      return next(new BadRequestError('Некорректный ID'));
    }
    return next(new ServerError(`Произошла ошибка: ${err}`))
  });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser
};