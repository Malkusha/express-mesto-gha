const Card = require("../models/card");
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  ServerError,
  AccessError
} = require("../errors/index");

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      return next(new ServerError(`Произошла ошибка: ${err}`))
    })
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(new ServerError(`Произошла ошибка: ${err}`))
    });
}

function deleteCardById(req, res, next) {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        return next(new AccessError('Нельзя удалить карточку, загруженную другим пользователем'))
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError('Некорректный ID карточки'));
      }
      return next(new ServerError(`Произошла ошибка: ${err}`))
    });
}

function setLike(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ message: "Карточка удалена" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError('Некорректный ID карточки'));
      }
      return next(new ServerError(`Произошла ошибка: ${err}`))
    });
}

function removeLike(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError('Некорректный ID карточки'));
      }
      return next(new ServerError(`Произошла ошибка: ${err}`))
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  setLike,
  removeLike,
};