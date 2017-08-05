import express from 'express';

const flightsRouter = express.Router();

export default (mw, apiRouter) => {
  apiRouter.use(
    '/flights',
    flightsRouter,
  );

  flightsRouter.get(
    '/quotes',
    mw.flights.getQuotes,
  );

  flightsRouter.get(
    '/routes',
    mw.flights.getRoutes,
  );

  return flightsRouter;
};
