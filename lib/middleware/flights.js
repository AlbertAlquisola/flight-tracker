import moment from 'moment';

import controllers from 'controllers';
import Logger from 'util/Logger';

const log = new Logger('mw/flights');

const DATE_FORMAT = `YYYY-MM-DD`;
const LOCALE = 'en-US';
const CURRENCY = 'usd';
const COUNTRY = 'US';
const INBOUND_DATE = 'anytime';

function getFlight(req, res, next) {
  let options = {};
  let date = moment(Date.now());

  if (!req.query.originPlace)
    return next(new Error('starting location missing! cannot complete query'));

  if (!req.query.destinationPlace)
    return next(new Error('destination missing! cannot complete query'));

  options.country = (req.query.country && req.query.country.toUpperCase()) || COUNTRY;
  options.currency = req.query.currency || CURRENCY;
  options.locale = req.query.locale || LOCALE;
  options.originPlace = req.query.origin;
  options.destinationPlace = req.query.destination;
  options.inboundDate = req.query.inboundDate || INBOUND_DATE;

  options.outboundDate = req.query.outboundDate ?
    req.query.outboundDate : date.format(DATE_FORMAT);

  options.inboundDate = req.query.inboundDate ?
    req.query.inboundDate : date.add(7, 'days').format(DATE_FORMAT);


  controllers.flights.getFlight(options, (error, flight) => {
    if (error) {
      log.error('getFlight', 'error getting flight', { error });
      return next(error);
    }

    return res.json(flight);
  });
}

export default { getFlight };

