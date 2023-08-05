const router = require("express").Router();

const auth = require("../middlewares/auth");
const usersRouter = require("./users");
const cardsRouter = require("./cards");

router.use("/users", auth, usersRouter);
router.use("/cards", auth, cardsRouter);

router.use((req, res) => {
  res.status(404).send({ message: `Ресурс по адресу ${req.path} не найден` });
});

module.exports = router;