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
usersRouter.patch("/me", updateUser);
usersRouter.patch("/me/avatar", updateAvatar);

module.exports = usersRouter;
