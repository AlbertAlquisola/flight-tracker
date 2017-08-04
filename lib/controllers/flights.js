import _ from 'lodash';
import request from 'request';
import { URL } from 'url';

import Logger from 'util/Logger';
const log = new Logger('controllers/flights');

const QUOTE_ENDPOINT = `http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0`;
const ROUTE_ENDPOINT = `http://partners.api.skyscanner.net/apiservices/browseroutes/v1.0`;

const skyScannerRequest = request.defaults({
  headers: { 'Accept': 'application/json' },
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

      let flightData = JSON.parse(body);
      const augmentedFlightData = augmentQuoteData(flightData);

      return callback(null, augmentedFlightData);
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

      let flightData = JSON.parse(body);
      const augmentedFlightData = augmentRouteData(flightData);

      return callback(null, augmentedFlightData);
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
  `.replace(/\s/g,'');

  const url = new URL(endpoint);
  url.searchParams.set('apiKey', process.env.SKYSCANNER_KEY);

  return url.toString();
}

function augmentQuoteData(flightData) {
  let placesMap = convertPlacesToMap(flightData.Places);
  let carriersMap = convertCarriersToMap(flightData.Carriers);

  let augmentedData = _.map(flightData.Quotes, (quote) => {
    _.map(quote.OutboundLeg.CarrierIds, (carrierId, index) => {
       quote.OutboundLeg.CarrierIds[index] = carriersMap[carrierId];
    });

    _.map(quote.InboundLeg.CarrierIds, (carrierId, index) => {
      quote.InboundLeg.CarrierIds[index] = carriersMap[carrierId];
    });

    quote.OutboundLeg.Origin = placesMap[quote.OutboundLeg.OriginId];
    quote.OutboundLeg.Destination = placesMap[quote.OutboundLeg.DestinationId];

    quote.InboundLeg.Origin = placesMap[quote.InboundLeg.OriginId];
    quote.InboundLeg.Destination = placesMap[quote.InboundLeg.DestinationId];

    delete quote.OutboundLeg.OriginId;
    delete quote.OutboundLeg.DestinationId;
    delete quote.InboundLeg.OriginId;
    delete quote.InboundLeg.DestinationId;

    return quote;
  });

  return _.sortBy(augmentedData, ['MinPrice']);
}

function augmentRouteData(flightData) {
  let placesMap = convertPlacesToMap(flightData.Places);

  let augmentedData = _.map(flightData.Routes, (route) => {
    route.Origin = placesMap[route.OriginId];
    route.Destination = placesMap[route.DestinationId];

    delete route.OriginId;
    delete route.DestinationId;

    return route;
  });

  return _.sortBy(augmentedData, 'Price');
}

function convertPlacesToMap(places) {
  let placesMap = {};

  _.each(places, (place) => {
     placesMap[place.PlaceId] = place;
  });

  return placesMap;
}

function convertCarriersToMap(carriers) {
  let carriersMap = {};

  _.each(carriers, (carrier) => {
    carriersMap[carrier.CarrierId] = carrier;
  });

  return carriersMap;
}
