import express from 'express';

const analyticsRouter = express.Router();

export default (mw, apiRouter) => {
  apiRouter.use(
    '/analytics',
    analyticsRouter,
  );

  analyticsRouter.post(
    '/',
    mw.analytics.recordEvent,
  );

  return analyticsRouter;
};

