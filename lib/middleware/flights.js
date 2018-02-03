import controllers from 'controllers';
import Logger from 'util/Logger';

import allAirports from 'airports/all_airports.json';
import domesticAirports from 'airports/domestic_airports.json';

const log = new Logger('mw/flights');

const LOCALE = 'en-US';
const CURRENCY = 'usd';
const COUNTRY = 'US';
const DEFAULT_DATE = 'anytime';

export default {
  getQuotes: (req, res, next) => {
    const options = {};

    if (!req.query.origin)
      return next(new Error('starting location missing! cannot complete query'));

    if (!req.query.destination)
      return next(new Error('destination missing! cannot complete query'));

    options.country = (req.query.country && req.query.country.toUpperCase()) || COUNTRY;
    options.currency = req.query.currency || CURRENCY;
    options.locale = req.query.locale || LOCALE;
    options.origin = req.query.origin;
    options.destination = req.query.destination;
    options.departureDate = DEFAULT_DATE;
    options.returnDate = DEFAULT_DATE;

    controllers.flights.getQuotes(options, (error, flight) => {
      if (error) {
        log.error('getQuotes', 'error getting quotes', { error });
        return next(error);
      }

      return res.json(flight);
    });
  },

  getRoutes: (req, res, next) => {
    const options = {};

    if (!req.query.origin)
      return next(new Error('starting location missing! cannot complete query'));

    if (!req.query.destination)
      return next(new Error('destination missing! cannot complete query'));

    options.country = (req.query.country && req.query.country.toUpperCase()) || COUNTRY;
    options.currency = req.query.currency || CURRENCY;
    options.locale = req.query.locale || LOCALE;
    options.origin = req.query.origin;
    options.destination = req.query.destination;
    options.departureDate = DEFAULT_DATE;
    options.returnDate = DEFAULT_DATE;

    controllers.flights.getRoutes(options, (error, routes) => {
      if (error) {
        log.error('getRoutes', 'error getting routes', { error });
        return next(error);
      }

      return res.json(routes);
    });
  },

  getAllAirports: (req, res, next) => {
    return res.json(allAirports);
  },

  getDomesticAirports: (req, res, next) => {
    return res.json(domesticAirports);
  },
};

