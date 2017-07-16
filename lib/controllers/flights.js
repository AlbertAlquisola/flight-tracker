import request from 'request';
import { URL } from 'url';

import Logger from 'util/Logger';
const log = new Logger('controllers/flights');

const quoteEndpoint = `http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0`;

function getFlight(options, callback) {
  const endpoint = `
    ${quoteEndpoint}/
    ${options.country}/
    ${options.currency}/
    ${options.locale}/
    ${options.origin}/
    ${options.destination}/
    ${options.outboundDate}/
    ${options.inboundDate}/
  `.replace(/\s/g,'');
  const url = new URL(endpoint);

  url.searchParams.set('apiKey', process.env.SKYSCANNER_KEY);

  request.get(url.toString(), (error, response, body) => {
    if (error) {
      log.error('getFlight', 'request error, check request body', { error });
      return callback(error);
    }

    if (response.statusCode > 300 || response.statusCode < 200) {
      log.error('getFlight', 'bad response from skyscanner', { msg: response.body, status: response.statusCode });
      return callback(new Error('bad response from skyscanner'));
    }

    return callback(null, JSON.parse(body));
  });

}

export default { getFlight };
