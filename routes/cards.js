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

cardsRouter.delete("/:cardId",
celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  })
}), deleteCardById);

cardsRouter.put("/:cardId/likes",
celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  })
}), setLike);

cardsRouter.delete("/:cardId/likes",
celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  })
}), removeLike);

module.exports = cardsRouter;
