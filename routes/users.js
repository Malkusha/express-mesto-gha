const usersRouter = require("express").Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");

usersRouter.get("/", getUsers);
usersRouter.get("/:userId", getUserById);
usersRouter.get("/me", getCurrentUser);
usersRouter.patch("/me", updateUser);
usersRouter.patch("/me/avatar", updateAvatar);

module.exports = usersRouter;
