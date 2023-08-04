const router = require("express").Router();


const usersRouter = require("./users");
const cardsRouter = require("./cards");

const {NotFoundError} = require("../errors/index")

router.use("/users", usersRouter);
router.use("/cards", cardsRouter);

router.use((req, res, next) => {
  next(new NotFoundError(`Ресурс по адресу ${req.path} не найден`));
});

module.exports = router;
