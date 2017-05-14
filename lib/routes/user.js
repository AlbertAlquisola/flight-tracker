import express from 'express';


const userRouter = express.Router();

export default (app, mw) => {
  app.use(
    '/user',
    userRouter
  );

  userRouter.get(
    '/',
    (req, res, next) => {
      if (req.user)
        return res.json({ user: req.user });

      return res.json({ user: null });
    }
  );

  return userRouter;
};