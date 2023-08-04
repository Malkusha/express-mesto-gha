const router = require("express").Router();
const auth = require("../middlewares/auth");
const authRouter = require("./auth");

const usersRouter = require("./users");
const cardsRouter = require("./cards");

const {NotFoundError} = require("../errors/index")

router.use("/", authRouter);
router.use("/users", auth, usersRouter);
router.use("/cards", auth, cardsRouter);

router.use((req, res, next) => {
  next(new NotFoundError(`Ресурс по адресу ${req.path} не найден`));
});

module.exports = router;
