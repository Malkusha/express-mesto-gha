const cardsRouter = require("express").Router();
const {Joi, celebrate} = require("celebrate");

const {
  getCards,
  createCard,
  deleteCardById,
  setLike,
  removeLike,
} = require("../controllers/cards");

cardsRouter.get("/", getCards);
cardsRouter.post("/", createCard);
cardsRouter.delete("/:cardId", deleteCardById);
cardsRouter.put("/:cardId/likes", setLike);
cardsRouter.delete("/:cardId/likes", removeLike);

module.exports = cardsRouter;
