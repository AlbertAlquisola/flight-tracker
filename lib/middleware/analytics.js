import controllers from 'controllers';
import Logger from 'util/Logger';

const log = new Logger('mw/analytics');

function recordEvent(req, res, next) {
  const { deviceId, eventName, payload } = req.body;
  const oldIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress.replace(/^.*:/, '');

  if (!deviceId)
    return next(new Error('no device id provided when trying to record analytics event'));

  if (!eventName)
    return next(new Error('no event name provided when trying to record analytics event'));

  controllers.analytics.recordEvent(oldIp, deviceId, eventName, payload, (error, results) => {
    if (error) {
      log.error('recordEvent', 'error recording analytics event', { error });
      return next(error);
    }

    return res.sendStatus(201);
  });
}

export default {
  recordEvent,
};
