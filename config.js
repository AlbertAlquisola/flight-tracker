/* Project flight tracker
 *
 * Copyright (c) 2017
 */
import path from 'path';

const config = {};

// path config
config.paths = {};
config.paths.rootDir = path.resolve(__dirname);

// port config
config.ports = { app: 3000 };

// logs config
config.logs = { mainLogger: 'flight_logs' };

// isProd convenience alias
config.isProd = process.env.NODE_ENV === 'production';

// mysql config
config.mysql = {};
config.mysql.db = process.env.MYSQL_DB;
config.mysql.host = process.env.MYSQL_HOST;
config.mysql.pass = process.env.MYSQL_PASS;
config.mysql.user = process.env.MYSQL_USER;
config.mysql.port = process.env.MYSQL_PORT;
config.mysql.connLimit = process.env.MYSQL_CONN_LIMIT;

// mixpanel config
config.mixpanel = {};
config.mixpanel.token = process.env.MIXPANEL_TOKEN;
config.mixpanel.secret = process.env.MIXPANEL_SECRET;

// error config
config.defaultStatusCode = 500;
config.defaultTimeout = 70000;

// redis config
config.redis = {};
config.redis.host = process.env.REDIS_HOST;
config.redis.port = process.env.REDIS_PORT;
config.redis.pass = process.env.REDIS_PASS;

export default config;
