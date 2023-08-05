const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const {errors} = require("celebrate");
const cookieParser = require("cookie-parser");

const authRouter = require('./routes/auth');
const router = require("./routes/index");

const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/mestodb" } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose.connect(DB_URL);

app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

app.use(authRouter);
app.use(router);
app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});