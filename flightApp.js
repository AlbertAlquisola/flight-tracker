/*
 *  Project Flight Tracker
 *
 */
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
import routes from 'routes';

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

const passportOptions = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
};

passport.use('local-signup', new Strategy(passportOptions, controllers.user.signup));
passport.use('local-login', new Strategy(passportOptions, controllers.user.login));

passport.serializeUser((id, callback) => {
  callback(null, id);
});

passport.deserializeUser((id, callback) => {
  controllers.user.getUserById(id, (err, user) => {
    return callback(err, user);
  });
});

// configure our routes
routes(app, mw, passport);

app.get(
  '/errorTest',
  (req, res, next) => { return next(new Error('is the error test working? IT BETTER BE!')); }
);

app.get(
  '/healthcheck',
  (req, res, next) => { return res.sendStatus(200); },
);

// /*
//  * ATTENTION! THIS MUST BE THE LAST app.use() IN MIDDLEWARE CHAIN
//  * This is our catch all error handler which sends a friendly message back to the client
//  * DO NOT put any other error handlers below this
//  */
app.use(errorHandler);

app.listen(config.ports.app, () => {
  console.log('bootup:', `express app listening on port ${config.ports.app}`);
});


