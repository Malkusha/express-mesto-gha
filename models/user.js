const mongoose = require("mongoose");
const validator = require("validator");
const {
  Unauthorized,
  BadRequest
} = require("../errors/unauthorized");
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
      required: true,
      minlengh: 8,
      select: false
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
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
      }
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return Promise.reject(new BadRequest('Некорректный формат данных' ));
      }
      return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
    });
};

module.exports = mongoose.model("user", userSchema);