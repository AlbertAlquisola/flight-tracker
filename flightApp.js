/*
 *  Project Flight Tracker
 *
 */
import _ from 'lodash';
import bodyParser from 'body-parser';
import compression from 'compression';
import ConnectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import express from 'express';
import passport from 'passport';
import Redis from 'ioredis';
import expressSession from 'express-session';
import { Strategy } from 'passport-local';

import config from 'config';
import controllers from 'controllers';
import errorHandler from 'util/errorHandler';
import Logger from 'util/Logger';
import mw from 'middleware';

// setup mysql connection pool
import'lib/models/database';

const app = express();
const log = new Logger('flightApp.js');

const redisClient = new Redis(config.redis);
const RedisStore = ConnectRedis(expressSession);
const session = expressSession({
  store: new RedisStore({ client : redisClient }),
  secret: 'takin flight',
  resave: true,
  saveUninitialized: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// auth
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

const passportOptions = { passReqToCallback: true };
// passport.use('local-login', new Strategy(passportOptions, controllers.user.validateCredentials));
// passport.use('local-signup', new Strategy(passportOptions, controllers.user.upsertUser));

passport.serializeUser((user, callback) => callback(null, user));

passport.deserializeUser((userInfo, callback) => {
  controllers.user.getUserInfo(userInfo.id, (err, user) => {
    user = _.extend({}, user, userInfo);

    return callback(err, user);
  });
});

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


