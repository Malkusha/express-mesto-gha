const authRouter = require("express").Router();
const {
  login,
  createUser
} = require("../controllers/users");

authRouter.post('/signin', login);
authRouter.post('/signup', createUser);

module.exports = authRouter;