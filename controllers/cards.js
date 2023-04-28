const NotFoundError = require('../errors/not-found-err');
const SomethingWrongRequest = require('../errors/somethingWrongRequest');
const ConflictError = require('../errors/conflictError');

const Card = require('../models/card');

// Get запрос возвращает карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

//Post создает карточку
module.exports.createCard = (req, res, next) => {

  Card.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new SomethingWrongRequest('При создании карточки переданы некорректные данные'));
      } else {
        next(err);
      }
    })
}

//Удаление карточки
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate('owner')
    .then((card) => {
      if (card.owner._id.toString() === req.user._id.toString()) {
        Card.deleteOne(card)
          .then((deletedCard) => {
            if (deletedCard) {
              res.send('Карточка удалена');
            } else {
              next(new NotFoundError('Карточка по _id не найдена!!!'));
            }
          });
      } else {
        next(new ConflictError('Для удаления карточки нет доступа'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new SomethingWrongRequest('id невалидный'));
      } else {
        next(err);
      }
    })
}

//Постановка лайка на карточку
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card: card.likes });
      } else {
        next(new NotFoundError('Карточка по _id не найдена!!!'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new SomethingWrongRequest('id невалидный'));
      } else {
        next(err);
      }
    })
}

//Удаление лайка с карточки
module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card: card.likes });
      } else {
        next(new NotFoundError('Карточка по _id не найдена!!!'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new SomethingWrongRequest('id невалидный'));
      } else {
        next(err);
      }
    });
}
