const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');
const validateURL = require('../middleware/validateURL');

const {
  getArticles,
  createArticle,
  likeArticle,
  unlikeArticle,
  deleteArticle,
} = require('../controllers/articles');

router.get('/', auth, getArticles);
router.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().required().custom(validateURL),
    }),
  }),
  createArticle,
);
router.put(
  '/likes/:id',
  auth,
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  likeArticle,
);

router.delete(
  '/likes/:id',
  auth,
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  unlikeArticle,
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
