const ERROR_CODE = 400;
const ERROR_SERVER = 500;
const ERROR_NOT_FOUND = 404;

const User = require('../models/user');

// Get запрос возвращает пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
    });
};

// Get запрос ищет пользователя по id
module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Передан некорретный ID' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка на сервере' });
      }
    });
}

// Создаем пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'При создании пользователя переданы некорректные данные' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

//Обновление профиля
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'При обновлении профиля переданы некорректные данные' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
      }
    });
}

//Обновление аватара
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по _id не найден' })
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'При обновлении аватара переданы некорректные данные' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
      }
    })
}