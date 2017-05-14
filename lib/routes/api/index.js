import express from 'express';

const apiRouter = express.Router();

export default (app, mw) => {
  app.use(
    '/api/v1',
    mw.auth.isAuthenticated,
    apiRouter
  );

  return {};
};