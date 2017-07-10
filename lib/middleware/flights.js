import moment from 'moment';

import controllers from 'controllers';
import Logger from 'util/Logger';

const log = new Logger('mw/flights');

function getFlight(req, res, next) {
  let options = {};
  let date = moment(Date.now());

  if (!req.query.originPlace)
    return next(new Error('starting location missing! cannot complete query'));

  if (!req.query.destinationPlace)
    return next(new Error('destination missing! cannot complete query'));

  options.country = (req.query.country && req.query.country.toUpperCase()) || 'US';
  options.currency = req.query.currency || 'usd';
  options.locale = req.query.locale || 'en-US';
  options.originPlace = req.query.originPlace;
  options.destinationPlace = req.query.destinationPlace;
  options.inboundDate = req.query.inboundDate || 'anytime';

  options.outboundDate = req.query.outboundDate ?
    req.query.outboundDate : date.format('YYYY-MM-DD');

  options.inboundDate = req.query.inboundDate ?
    req.query.inboundDate : date.add(7, 'days').format('YYYY-MM-DD');


  controllers.flights.getFlight(options, (error, flight) => {
    if (error) {
      log.error('getFlight', 'error getting flight', { error });
      return next(error);
    }

    return res.json(flight);
  });
}

export default { getFlight };

