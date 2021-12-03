function notFoundMiddleware (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
}

export default notFoundMiddleware;
