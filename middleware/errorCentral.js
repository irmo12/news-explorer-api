module.exports = (err, req, res, next) => {
  /* eslint-disable no-param-reassign */
  if (!err.statusCode) { err.statusCode = 500; }
  /* eslint-enable no-param-reassign */
  res.status(err.statusCode).send({
    message:
      err.statusCode === 500 ? 'An error occurred on the server' : err.message,
  });
  next();
};
