/*
 *  Project Flight Tracker
 *
 */
import _ from 'lodash';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import session from 'express-session';
import passport from 'passport';
import Redis from 'redis';
import ConnectRedis from 'connect-redis';

import config from 'config';
import controllers from 'controllers';
import mw from 'middleware';
import Logger from 'util/Logger';
import errorHandler from 'util/errorHandler';

// setup mysql connection pool and initialize database
import db from 'lib/models/database';

const RedisStore = ConnectRedis(session);
const log = new Logger('flightApp.js');
const app = express();

app.get(
  '/errorTest',
  (req, res, next) => { return next(new Error('is the error test working? IT BETTER BE!')); }
);

// /*
//  * ATTENTION! THIS MUST BE THE LAST app.use() IN MIDDLEWARE CHAIN
//  * This is our catch all error handler which sends a friendly message back to the client
//  * DO NOT put any other error handlers below this
//  */
app.use(errorHandler);

app.listen(config.ports.app, () => {
  log.info('bootup', `express app listening on port ${config.ports.app}`);
});