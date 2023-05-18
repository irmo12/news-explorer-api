module.exports = (err, req, res, next) => {
  err.statusCode ||= 500;
  res.status(err.statusCode).send({
    message:
      err.statusCode === 500 ? 'An error occurred on the server' : err.message,
  });
  next();
};
