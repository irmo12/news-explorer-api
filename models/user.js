const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(mail) {
        return validator.isEmail(mail);
      },
      message: 'must be a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: '-',
  },
});

userSchema.statics.getUserByCredentials = async function getUserByCredentials(
  email,
  password,
) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    throw new Unauthorized('Wrong email or password');
  }
  const matched = await bcrypt.compare(password, user.password);
  if (matched) {
    return user;
  }
  throw new Unauthorized('Wrong email or password');
};

module.exports = mongoose.model('User', userSchema);
