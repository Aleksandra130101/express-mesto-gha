const jwt = require('jsonwebtoken');
const AuthorizeError = require('../errors/authorizeError');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new AuthorizeError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(req.cookies.jwt, 'some-secret-key');
  } catch (err) {
    return next(new AuthorizeError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
