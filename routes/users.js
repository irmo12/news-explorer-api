const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');
const validateURL = require('../middleware/validateURL');

const { getUser, patchUser, patchUserAvatar } = require('../controllers/users');

router.get('/me', auth, getUser);

router.patch(
  '/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  patchUser,
);

router.patch(
  '/me/avatar',
  auth,
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL),
    }),
  }),
  patchUserAvatar,
);

module.exports = { usersRoute: router };
