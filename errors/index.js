const NotFoundError = require("./not-found-err");
const BadRequest = require("./bad-req");
const Unauthorized = require("./unauthorized");
const Conflict = require("./conflict");
const ServerError = require("./serverError");
const AccessError = require("./accessError");

module.exports = {
  NotFoundError,
  BadRequest,
  Unauthorized,
  Conflict,
  ServerError,
  AccessError
}