const usersRouter = require("express").Router();
const {Joi, celebrate} = require("celebrate");

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");

usersRouter.get("/", getUsers);
usersRouter.get("/me", getCurrentUser);
usersRouter.get("/:userId",
celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  })
}), getUserById);
usersRouter.patch("/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    })
  }), updateUser);
usersRouter.patch("/me/avatar",
  celebrate({
    body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(/^(http|https):\/\/([\w\.]+)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/))
    })
  })
  , updateAvatar);

module.exports = usersRouter;
