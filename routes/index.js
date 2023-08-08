const router = require("express").Router();
const {Joi, celebrate} = require("celebrate");

const regexLink = require("../utils/constants");
const {login, createUser} = require("./controllers/users");
const auth = require("../middlewares/auth");
const usersRouter = require("./users");
const cardsRouter = require("./cards");
const { UnauthorizedError } = require("../errors");

router.post('/signin',
celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  })
}), login);
router.post('/signup',
celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(regexLink))
  })
}), createUser);

router.use("/users", auth, usersRouter);
router.use("/cards", auth, cardsRouter);

router.use((req, res, next) => {
  next(new UnauthorizedError(`Ресурс по адресу ${req.path} не найден`))
});

module.exports = router;