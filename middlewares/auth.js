const jwt = require('jsonwebtoken');
const {UnauthorizedError} = require('../errors/index');

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};

module.exports.auth = (req, res, next) => {
  console.log(req.headers);
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};