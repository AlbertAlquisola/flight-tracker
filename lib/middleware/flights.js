import controllers from 'controllers';
import Logger from 'util/Logger';

const log = new Logger('mw/flights');

const LOCALE = 'en-US';
const CURRENCY = 'usd';
const COUNTRY = 'US';
const DEFAULT_DATE = 'anytime';

function getFlight(req, res, next) {
  let options = {};

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

  controllers.flights.getFlight(options, (error, flight) => {
    if (error) {
      log.error('getFlight', 'error getting flight', { error });
      return next(error);
    }

    return res.json(flight);
  });
}

export default { getFlight };

