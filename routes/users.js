const usersRouter = require("express").Router();

const {
  getMe,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require("../controllers/users");


usersRouter.get("/", getUsers);
usersRouter.get("/:userId", getUserById);
usersRouter.get("/me", getMe);
usersRouter.patch("/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(new RegExp(/^(http|https):\/\/([\w\.]+)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/))
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
