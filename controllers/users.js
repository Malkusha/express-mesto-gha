const User = require("../models/user");
const bcrypt = require("bcryptjs");

const {
  NotFoundError,
  BadRequest,
  Unauthorized,
  Conflict,
  ServerError
} = require("../errors");



function getMe(req, res) {
  User.findById(req.user._id)
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err.name === "CastError") {
      next(new BadRequest('Некорректный ID'));
    }
    next();
  });
}

function getUsers(req, res) {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next(new ServerError('Авторизуйтесь')));
}

function getUserById(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest('Некорректный ID'));
      }
      next(new ServerError('Авторизуйтесь'));
    });
}

function createUser(req, res) {
  bcrypt.hash(password, 10)
    .then(hash => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar
    }))
    .then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с такой почтой уже зарегистрирован'));
      } else
      if (err.name === "ValidationError") {
        next(new NotFoundError('Пользователь не найден'));
      }
      next(new ServerError('Авторизуйтесь'));
    });
}

function login(req, res) {
  const {email, password} = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Проверьте корректность данных'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        Promise.reject(new Unauthorized('Проверьте корректность данных'));
  }
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', {expiresIn: '7d'})
      })
  }
  )
    .catch((err) => {
      next(new Unauthorized('Проверьте корректность данных'));
    });
};

function updateUser(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'))
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new Unauthorized('Переданы некорректные данные'))  //return res.status(400).send({ message: "Переданы некорректные данные" });
      }
      next(new ServerError('Произошла ошибка'))//return res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'))//return res.status(404).send({ message: "Пользователь не найден" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new Unauthorized('Переданы некорректные данные'))//return res.status(400).send({ message: "Переданы некорректные данные" });
      }

      next(new ServerError('Произошла ошибка'))//return res.status(500).send({ message: `Произошла ошибка ${err}` });
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
