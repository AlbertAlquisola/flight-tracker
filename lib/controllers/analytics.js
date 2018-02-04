import async from 'async';
import Mixpanel from 'mixpanel';

import config from 'config';
import Logger from 'util/Logger';

const log = new Logger('controllers/analytics');
const mixpanel = Mixpanel.init(config.mixpanel.token, { protocol: 'https' });

function recordEvent(ip, deviceId, eventName, payload, callback) {
  async.parallel([
    function addUser(cb) {
      const data = { $ip: ip, $created: (new Date()).toISOString() };

      mixpanel.people.set(deviceId, data, (error) => {
        if (error) {
          log.error('recordEvent', 'error adding user on mixpanel', { error });
          return cb(error);
        }

        return cb();
      });
    },

    function trackEvent(cb) {
      const data = {
        ip,
        deviceId,
        payload,
        distinct_id: deviceId,
        time: new Date(),
      };

      mixpanel.track(eventName, data, (error) => {
        if (error) {
          log.error('recordEvent', 'error when recording event with mixpanel', { error });
          return cb(error);
        }

        return cb();
      });
    },
  ], (error, results) => {
    if (error) {
      log.error('recordEvent', 'error recording mixpanel event', { error });
      return callback(error);
    }

    return callback();
  });
}

export default { recordEvent };
