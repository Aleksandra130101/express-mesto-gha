const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('validator');
const { celebrate, Joi, errors } = require('celebrate');

const routes = require('./routes/index');
const auth = require('./middlewares/auth');
const handleError = require('./middlewares/error');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// Здесь роутинг
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new Error('Неправильный формат ссылки');
      }
      return value;
    }, 'custom validation'),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(cookieParser());
app.use(auth);
app.use(routes);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  console.log(` App listening on port ${PORT} `);
});
