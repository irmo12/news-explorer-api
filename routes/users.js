const router = require('express').Router();
const auth = require('../middleware/auth');

const { getUser } = require('../controllers/users');

router.get('/me', auth, getUser);

module.exports = { usersRoute: router };
