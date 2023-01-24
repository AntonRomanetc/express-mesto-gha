const Card = require('../models/card');

const ok = 200;
const created = 201;
const badRequest = 400;
const notFound = 404;
const internalServerError = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(ok).send({ data: cards }))
    .catch((err) => res.status(internalServerError).send({ message: `${err.message}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(created).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы невалидные данные для создания карточки' });
      } else {
        res.status(internalServerError).send({ message: `${err.message}` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      res.status(notFound);
      throw Error;
    })
    .then(() => res.status(ok).send({ message: 'Пост удален' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Передан невалидный id карточки' });
      } else if (res.statusCode === 404) {
        res.send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(internalServerError).send({ message: `${err.message}` });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(notFound);
      throw Error;
    })
    .then((card) => res.status(ok).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы невалидные данные карточки' });
      } else if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Передан невалидный id карточки' });
      } else if (res.statusCode === 404) {
        res.send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(internalServerError).send({ message: `${err.message}` });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(notFound);
      throw Error;
    })
    .then((card) => res.status(ok).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы невалидные данные карточки' });
      } else if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Передан невалидный id карточки' });
      } else if (res.statusCode === 404) {
        res.send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(internalServerError).send({ message: `${err.message}` });
      }
    });
};
