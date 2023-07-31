const User = require('../models/user');
const mongoose = require('mongoose');

function getUsers(req, res) {
  User.find({})
  .then(users => res.status(200).send({ data: users }))
  .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

function getUserById(req,res) {
  const { userId } = req.params;
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: `Пользователь не найден` });
      }
      res.status(200).send({ data: user })
    })
    .catch((err) => {
        if (err.name === 'CastError') {
          return res.status(400).send({ message: `Некорректный ID` });
        }
        res.status(500).send({ message: `Произошла ошибка ${err}` });
    })
}

function createUser(req, res) {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then(user => res.status(201).send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Переданы некорректные данные` });
      }
      else {
        res.status(500).send({ message: `Произошла ошибка ${err}` });
      }
    })
};

function updateUser(req, res) {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, {new: true, runValidators: true})
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: `Пользователь не найден` });
      }
      res.status(200).send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Переданы некорректные данные` });
      }
      else {
        res.status(500).send({ message: `Произошла ошибка ${err}` });
      }
    })
}

function updateAvatar(req, res) {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, {new: true, runValidators: true})
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: `Пользователь не найден` });
      }
      res.status(200).send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Переданы некорректные данные` });
      }
      else {
        res.status(500).send({ message: `Произошла ошибка ${err}` });
      }
    })
}


module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar
}