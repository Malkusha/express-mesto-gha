const authRouter = require("express").Router();
const {Joi, celebrate, errors} = require("celebrate");


const {
  login,
  createUser
} = require("../controllers/users");

authRouter.use(errors());

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
        avatar: Joi.string().pattern(new RegExp(/^(http|https):\/\/([\w\.]+)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/))
      })
    }),
  createUser);

module.exports = authRouter;