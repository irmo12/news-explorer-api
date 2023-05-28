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
const auth = require('./middleware/auth');
const router = require('./routes');
const errorCentral = require('./middleware/errorCentral');
const NotFound = require('./errors/not-found-err');

const { PORT = 3000, DB_ADDRESS } = process.env;

const app = express();

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

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
      userName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use('*', auth, (req, res, next) => (next(new NotFound('Requested resource does not exist'))));

app.use(errorLogger);

app.use(errors());

app.use(errorCentral);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
