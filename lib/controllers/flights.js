import _ from 'lodash';
import moment from 'moment';
import request from 'request';
import { URL } from 'url';

import Logger from 'util/Logger';
import logos from 'airports/logos';

const log = new Logger('controllers/flights');

const BASE_URL = `http://partners.api.skyscanner.net/apiservices`;
const QUOTE_ENDPOINT = `${BASE_URL}/browsequotes/v1.0`;
const ROUTE_ENDPOINT = `${BASE_URL}/browseroutes/v1.0`;
const REFERRAL_ENDPOINT = `${BASE_URL}/referral/v1.0`;
const SHORT_KEY = process.env.SKYSCANNER_KEY.substr(0, 16);

const skyScannerRequest = request.defaults({
  headers: { Accept: 'application/json' },
});

export default {
  getQuotes: (options, callback) => {
    const url = buildUrl(QUOTE_ENDPOINT, options);

    skyScannerRequest.get(url, (error, response, body) => {
      if (error) {
        log.error('getQuotes', 'request error, check request body', { error });
        return callback(error);
      }

      if (response.statusCode > 300 || response.statusCode < 200) {
        log.error('getQuotes', 'bad response from skyscanner', { msg: response.body, status: response.statusCode });
        return callback(new Error(response.body));
      }

      const flightData = JSON.parse(body);
      const augmentedFlightData = augmentQuoteData(flightData, options);

      return callback(null, { data: augmentedFlightData });
    });
  },

  getRoutes: (options, callback) => {
    const url = buildUrl(ROUTE_ENDPOINT, options);

    skyScannerRequest.get(url, (error, response, body) => {
      if (error) {
        log.error('getRoutes', 'request error, check request body', { error });
        return callback(error);
      }

      if (response.statusCode > 300 || response.statusCode < 200) {
        log.error('getRoutes', 'bad response from skyscanner', { msg: response.body, status: response.statusCode });
        return callback(new Error(response.body));
      }

      const flightData = JSON.parse(body);
      const augmentedFlightData = augmentRouteData(flightData);

      return callback(null, { data: augmentedFlightData });
    });
  },
};

function buildUrl(endpointUrl, options) {
  const endpoint = `
    ${endpointUrl}/
    ${options.country}/
    ${options.currency}/
    ${options.locale}/
    ${options.origin}/
    ${options.destination}/
    ${options.departureDate}/
    ${options.returnDate}/
  `.replace(/\s/g, '');

  const url = new URL(endpoint);
  url.searchParams.set('apiKey', process.env.SKYSCANNER_KEY);

  return url.toString();
}

function augmentQuoteData(flightData, options) {
  const placesMap = convertPlacesToMap(flightData.Places);
  const carriersMap = convertCarriersToMap(flightData.Carriers);

  // remove any trips that are shorter than 2-3 days, depending on if its domestic or international
  flightData.Quotes = _.filter(flightData.Quotes, (quote) => {
    const departureDate = moment(quote.OutboundLeg.DepartureDate);
    const returnDate = moment(quote.InboundLeg.DepartureDate);
    const duration = moment.duration(returnDate.diff(departureDate));

    // check if domestic or international trip
    const numDays = quote.OutboundLeg.OriginId === quote.OutboundLeg.DestinationId ? 2 : 4;

    return duration.asDays() >= numDays;
  });

  const augmentedData = _.map(flightData.Quotes, (quote) => {
    _.map(quote.OutboundLeg.CarrierIds, (carrierId, index) => {
      quote.OutboundLeg.CarrierIds[index] = carriersMap[carrierId];
    });

    _.map(quote.InboundLeg.CarrierIds, (carrierId, index) => {
      quote.InboundLeg.CarrierIds[index] = carriersMap[carrierId];
    });

    const originCode = placesMap[quote.OutboundLeg.OriginId].SkyscannerCode;
    const destinationCode = placesMap[quote.OutboundLeg.DestinationId].SkyscannerCode;
    const departureDate = moment(quote.OutboundLeg.DepartureDate).format('YYYY-MM-DD');
    const returnDate = moment(quote.InboundLeg.DepartureDate).format('YYYY-MM-DD');

    quote.ReferralLink = buildReferralLink(options, originCode, destinationCode, departureDate, returnDate);

    quote.OutboundLeg.Origin = placesMap[quote.OutboundLeg.OriginId];
    quote.OutboundLeg.Destination = placesMap[quote.OutboundLeg.DestinationId];

    quote.InboundLeg.Origin = placesMap[quote.InboundLeg.OriginId];
    quote.InboundLeg.Destination = placesMap[quote.InboundLeg.DestinationId];

    quote.DaysOld = moment().diff(moment(quote.QuoteDateTime), 'days');

    delete quote.OutboundLeg.OriginId;
    delete quote.OutboundLeg.DestinationId;
    delete quote.InboundLeg.OriginId;
    delete quote.InboundLeg.DestinationId;

    return quote;
  });

  return _.sortBy(augmentedData, ['MinPrice']);
}

function augmentRouteData(flightData) {
  const placesMap = convertPlacesToMap(flightData.Places);
  const quotesMap = convertQuotesToMap(flightData.Quotes);

  const augmentedData = _.map(flightData.Routes, (route) => {
    route.Origin = placesMap[route.OriginId];
    route.Destination = placesMap[route.DestinationId];
    route.Quotes = [];

    _.each(route.QuoteIds, (quoteId) => {
      route.Quotes.push(quotesMap[quoteId]);
    });

    delete route.QuoteIds;
    delete route.OriginId;
    delete route.DestinationId;

    return route;
  });

  return _.sortBy(augmentedData, 'Price');
}

function convertPlacesToMap(places) {
  const placesMap = {};

  _.each(places, (place) => {
    placesMap[place.PlaceId] = place;
  });

  return placesMap;
}

function convertQuotesToMap(quotes) {
  const quotesMap = {};

  _.each(quotes, (quote) => {
    quotesMap[quote.QuoteId] = quote;
  });

  return quotesMap;
}

function convertCarriersToMap(carriers) {
  const carriersMap = {};

  _.each(carriers, (carrier) => {
    addLogo(carrier);
    carriersMap[carrier.CarrierId] = carrier;
  });

  return carriersMap;
}

function addLogo(carrier) {
  const carrierName = carrier.Name.toLowerCase();
  const defaultLogo = 'https://cdn0.iconfinder.com/data/icons/citycons/150/Citycons_plane-32.png';

  if (logos[carrierName]) {
    carrier.logo = logos[carrierName];
    return;
  }

  _.forOwn(logos, (value, key) => {
    if ((_.includes(key, carrierName) || _.includes(carrierName, key)) && !carrier.logo) {
      carrier.logo = value;
    }
  });

  if (!carrier.logo) {
    carrier.logo = defaultLogo;
  }
}

function buildReferralLink(options, origin, destination, outboundDate, inboundDate) {
  return `
    ${REFERRAL_ENDPOINT}/
    ${options.country}/
    ${options.currency}/
    ${options.locale}/
    ${origin}/
    ${destination}/
    ${outboundDate}/
    ${inboundDate}?
    apiKey=${SHORT_KEY}
  `.replace(/\s/g, '');
}
