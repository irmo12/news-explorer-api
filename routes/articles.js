const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');
const validateURL = require('../middleware/validateURL');

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

router.get('/', auth, getArticles);
router.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().custom(validateURL),
      image: Joi.string().required().custom(validateURL),
    }),
  }),
  createArticle,
);

router.delete(
  '/:id',
  auth,
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteArticle,
);

module.exports = { articlesRoute: router };
