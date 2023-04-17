const ERROR_CODE = 400;
const ERROR_SERVER = 500;
const ERROR_NOT_FOUND = 404;

const Card = require('../models/card');

// Get запрос возвращает карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    });
};

//Post создает карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'При создании карточки переданы некорректные данные' })
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' })
      }
    })
}

//Удаление карточки
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ message: "Карточка удалена" })
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: "Карточка по _id не найдена" })
      }
    })
    .catch((err) => {
      if (err === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'id невалидный' })
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' })
      }
    })
}

//Постановка лайка на карточку
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card: card.likes });
      } else {
        res.status(ERROR_NOT_FOUND).send({message: 'Карточка по id не найдена'})
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({message: 'Невалидный id'})
      } else {
        res.status(ERROR_NOT_FOUND).send('Произошла ошибка на сервере')
      }
    })
}

//Удаление лайка с карточки
module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card: card.likes });
      } else {
        res.status(ERROR_NOT_FOUND).send({message: 'Карточка по id не найдена'})
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({message: 'Невалидный id'})
      } else {
        res.status(ERROR_NOT_FOUND).send('Произошла ошибка на сервере')
      }
    });
}
