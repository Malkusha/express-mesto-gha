const Card = require("../models/card");

function getCards(req, res) {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Переданы некорректные данные" });
      }
      return res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
}

function deleteCardById(req, res) {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      if (!card.owner._id === req.user._id) {
        return res.send({message: "Нельзя удалить карточку, загруженную другим пользователем"});
      }
      return res.send({ message: "Карточка удалена" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Некорректный ID карточки" });
      }
      return res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
}

function setLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Некорректный ID карточки" });
      }
      return res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
}

function removeLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Некорректный ID карточки" });
      }
      return res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  setLike,
  removeLike,
};
