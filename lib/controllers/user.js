import _ from 'lodash';
import async from 'async';
import passwordHash from 'password-hash-and-salt';

import models from 'models';
import Logger from 'util/Logger';
import { User } from 'dtos';

const log = new Logger('controllers/user');

function signup(req, email, plainTextPassword, mainCallback) {
  let hashedPassword;

  async.waterfall([
    function getUserByEmail(callback) {
      models.user.getUserByEmail(email, (error, user) => {
        if (error)
          return callback(error);

        if (user)
          return callback(new Error('email already registered'));

        return callback();
      });
    },

    function hashPassword(callback) {
      passwordHash(plainTextPassword).hash((error, hash) => {
        if (error)
          return callback(error);

        hashedPassword = hash;

        return callback();
      });
    },

    function insertUser(callback) {
      const user = new User({
        email,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });

      models.user.insertUser(user.toJS(), (error, id) => {
        if (error)
          return callback(error);

        return callback(null, id);
      });
    },
  ], (error, id) => {
    if(error) {
      log.error('signup', 'error signing up user', { error, email });
      return mainCallback(error);
    }

    return mainCallback(null, id);
  });
};

function login(req, email, plainTextPassword, mainCallback) {
  let isVerified = true;

  async.waterfall([
    function getUserByEmail(callback) {
      models.user.getUserByEmail(email, (error, user) => {
        if (error)
          return callback(error);

        if (!user)
          return callback(new Error(`user not found! email: ${email}`));

        return callback(null, user);
      });
    },

    function validatePassword(user, callback) {
      passwordHash(plainTextPassword).verifyAgainst(user.password.toString(), (error, verified) => {
        if (error)
          return callback(error);

        if (!verified) {
          isVerified = false;
          return callback(null, user);
        }

        return callback(null, user);
      });
    }
  ], (error, user) => {
    if (error) {
      log.error('login', 'error when logging in', { error, email });
      return mainCallback(error);
    }

    if (!isVerified)
      return mainCallback(null, false);

    return mainCallback(null, user.id);
  });
};

function getUserById(id, mainCallback) {
  async.waterfall([
    function getUserById(callback) {
      models.user.getUserById(id, (error, user) => {
        if (error)
          return callback(error);

        return callback(null, user);
      });
    }
  ], (error, user) => {
    if (error) {
      log.error('getUserById', 'error getting userBy ID', { id });
      return mainCallback(error);
    }

    return mainCallback(null, user);
  });
}

export default {
  signup,
  login,
  getUserById,
};
