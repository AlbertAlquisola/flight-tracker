function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();

  return next(new Error('user not authorized'));
}

export default {
  isAuthenticated,
};

