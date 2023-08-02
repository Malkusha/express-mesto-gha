const authRouter = require("express").Router();
const {Joi, celebrate} = require("celebrate");

const {
  login,
  createUser
} = require("../controllers/users");

authRouter.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    })
  }),
  login);
authRouter.post('/signup',
    celebrate({
      body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
        name: Joi.string().min(2).max(30),
        age: Joi.number().integer().required().min(18),
        about: Joi.string().min(2).max(30),
        avatar: Joi.string().pattern(/(http|https):\/\/((\w{3})?+(?:(?:\.(\w{3})?+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/)
      })
    }),
  createUser);

module.exports = authRouter;