const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");

const router = require("./routes/index");

const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/mestodb" } = process.env;
const app = express();

mongoose.connect(DB_URL);

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "64c6eacfc4c475ca6df4448f", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
