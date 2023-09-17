const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { OK, CREATED } = require('../utils/utils');
const BadReq = require('../errors/bad-req-err');
const NotFound = require('../errors/not-found-err');
const Conflict = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById({ _id })
    .orFail(new NotFound('no user by that id'))
    .then((user) => {
      res.status(OK).send({
        data: {
          name: user.name,
        },
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.getUserByCredentials(email, password)
    .then((userP) => {
      const token = jwt.sign(
        { _id: userP._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret',
        {
          expiresIn: '7d',
        },
      );
      res.status(OK).send({ token });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFound('user does not exist'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  let {
    email, name,
  } = req.body;
  const { password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      ({
        email, name,
      } = user);
      res.status(CREATED).send({
        data: {
          email, name,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadReq(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(', ')}`,
          ),
        );
      }
      if (err.code === 11000) {
        return next(
          new Conflict('A user with that email is already registered'),
        );
      }
      return next(err);
    });
};

module.exports = {
  getUser,
  createUser,
  login,
};
