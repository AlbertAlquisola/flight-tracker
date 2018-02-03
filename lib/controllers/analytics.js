import Mixpanel from 'mixpanel';

import config from 'config';
import Logger from 'util/Logger';

const log = new Logger('controllers/analytics');

const mixpanel = Mixpanel.init(config.mixpanel.token, { protocol: 'https' });

function recordEvent(ip, deviceId, eventName, payload, callback) {
  const data = {
    ip,
    deviceId,
    payload,
    distinct_id: deviceId,
    time: new Date(),
  };

  mixpanel.people.set(deviceId, {
    $ip: ip,
    $created: (new Date()).toISOString(),
  })

  mixpanel.track(eventName, data, (error) => {
    if (error) {
      log.error('recordEvent', 'error when recording event with mixpanel', { error });
      return callback(error);
    }

    return callback();
  });
}

export default { recordEvent };
