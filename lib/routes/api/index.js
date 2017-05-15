import express from 'express';

import flights from './flights';

const apiRouter = express.Router();

export default (app, mw) => {
  app.use(
    '/api/v1',
    mw.auth.isAuthenticated,
    apiRouter
  );

  return {
    flights: flights(mw, apiRouter)
  };
};