const NotFoundError = require("./not-found-error");//404
const BadRequestError = require("./bad-request-error");//400
const UnauthorizedError = require("./unauthorized-error");//401
const ConflictError = require("./conflict-error");//409
const ServerError = require("./server-error");//500
const AccessError = require("./access-error");//403

module.exports = {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  ServerError,
  AccessError
}