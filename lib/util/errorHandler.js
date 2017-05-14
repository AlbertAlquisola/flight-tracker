import config from 'config';
import Logger from 'util/Logger';

const log = new Logger('errorHandler');

export default (error, req, res, next) => {
  const message = error.message || 'Something went wrong. Try again';
  const statusCode = error.statusCode || config.defaultStatusCode;
  const clientError = { error: { message, statusCode } };

  return res.json(clientError);
};
