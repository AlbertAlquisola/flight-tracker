import express from 'express';

const authRouter = express.Router();

export default (app, passport) => {
  app.use(
    '/auth',
    authRouter,
  );

  authRouter.post(
    '/signup',
    passport.authenticate('local-signup'),
    (req, res, next) => {
      return res.status(201).json({ statusCode: 201, message: 'user created successfully'});
    },
  );

  authRouter.post(
    '/login',
    passport.authenticate('local-login'),
    (req, res, next) => {
      return res.status(201).json({ statusCode: 201, messsage: 'login successful' });
    }
  );

  authRouter.get(
    '/logout',
    (req, res, next) => {
      if (typeof req.logout === 'function')
        req.logout();

      return res.status(200).json({ message: 'logged out successfully' });
    }
  )

  return authRouter;
};