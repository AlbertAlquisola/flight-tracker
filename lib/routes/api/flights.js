import express from 'express';

const flightsRouter = express.Router();

export default (mw, apiRouter) => {
  apiRouter.use(
    '/flights',
    flightsRouter,
  );

  flightsRouter.get(
    '/',
    mw.flights.getFlight,
  )

  flightsRouter.get(
    '/:id',
    (req, res, next) => res.json({ message: 'should return a specific flight' }),
  );

  return flightsRouter;
};
