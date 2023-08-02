const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Некорректный Email"
      },
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: "Жак-Ив Кусто",
      minlength: [2, "Минимальная длина поля \"name\" - 2"],
      maxlength: [30, "Максимальная длина поля \"name\" - 30"],
    },
    about: {
      type: String,
      default: "Исследователь",
      minlength: [2, "Минимальная длина поля \"name\" - 2"],
      maxlength: [30, "Максимальная длина поля \"name\" - 30"],
    },
    avatar: {
      type: String,
      default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Некорректный URL",
      },
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.send({ message: "Почта или пароль указаны неверно"});
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return res.send({ message: "Почта или пароль указаны неверно"});
      }
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = mongoose.model("user", userSchema);