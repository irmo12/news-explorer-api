const Article = require('../models/article');
const { CREATED } = require('../utils/utils');
const BadReq = require('../errors/bad-req-err');
const NotFound = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .orFail()
    .then((Articles) => {
      res.send(Articles);
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((resArticle) => res.status(CREATED).send(resArticle))
    .catch((err) => {
      if (err.name === 'validationError') {
        next(new BadReq('Invalid Article information'));
      } else {
        next(err);
      }
    });
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .orFail()
    .then((resArticle) => {
      if (!resArticle.owner.equals(req.user._id)) {
        return next(new Forbidden('only the article poster may delete it'));
      }
      return resArticle.deleteOne().then(() => res.send(resArticle));
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFound('No article found with that id'));
      } if (err.name === 'CastError') {
        return next(new BadReq('cast error, check body'));
      } return next(err);
    });
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
