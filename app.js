require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { urlencoded } = require('express');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middleware/logger');
const limiter = require('./utils/limiter');
const { login, createUser } = require('./controllers/users');
const router = require('./routes');
const errorCentral = require('./middleware/errorCentral');
const NotFound = require('./errors/not-found-err');
const validateURL = require('./middleware/validateURL');

mongoose.connect('mongodb://localhost:27017/NEWSEXPLORERDB', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(requestLogger);
app.use(limiter);
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(urlencoded({ extended: true }));

app.use('/', router);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateURL),
    }),
  }),
  createUser,
);

app.use('*', (req, res, next) => (new NotFound('Requested resource does not exist')));

app.use(errorLogger);

app.use(errors());

app.use(errorCentral);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
