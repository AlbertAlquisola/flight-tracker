export default {
  isAuthenticated: (req, res, next) => {
    // TODO: [Albert
    // forward for now until authentication is implemented
    return next();

    if (req.user)
      return next();

    return next(new Error('user not authorized'));
  },
}

