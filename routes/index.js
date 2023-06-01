const router = require('express').Router();

const { usersRoute } = require('./users');
const { articlesRoute } = require('./articles');

router.use('/users', usersRoute);
router.use('/articles', articlesRoute);

module.exports = router;
