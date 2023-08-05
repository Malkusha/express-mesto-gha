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
cardsRouter.post("/",
celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(new RegExp(/^(http|https):\/\/([\w\.]+)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/))
  })
}), createCard);
cardsRouter.delete("/:cardId", deleteCardById);
cardsRouter.put("/:cardId/likes", setLike);
cardsRouter.delete("/:cardId/likes", removeLike);

module.exports = cardsRouter;
