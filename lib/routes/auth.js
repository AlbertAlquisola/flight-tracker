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
  );

  authRouter.post(
    '/login',
    passport.authenticate('local-login'),
  );

  return authRouter;
};