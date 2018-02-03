import express from 'express';

import flights from './flights';
import analytics from './analytics';

const apiRouter = express.Router();

export default (app, mw) => {
  app.use(
    '/api/v1',
    apiRouter
  );

  return {
    analytics: analytics(mw, apiRouter),
    flights: flights(mw, apiRouter),
  };
};
