const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const {Joi, celebrate, errors} = require("celebrate");

const {login, createUser} = require("./controllers/users");
const {auth} = require("./middlewares/auth");
const router = require("./routes/index");

const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/mestodb" } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {autoIndex: true});

app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

app.post('/signin',
celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  })
}), login);
app.post('/signup',
celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(/^(http|https):\/\/([\w\.]+)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/))
  })
}), createUser);

//app.use(auth);
app.use("/", auth, router);
app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});