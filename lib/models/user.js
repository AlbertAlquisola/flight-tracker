import _ from 'lodash';
import db from 'models/database';
import Logger from 'util/Logger';

const log = new Logger('models/user');

function getUserByEmail(email, callback) {
  const sql = `SELECT * FROM users WHERE email = ?`;
  const params = [email];

  db.executeQueryWithParams(sql, params, (error, user) => {
    if (error) {
      log.error('getUserByEmail', 'error finding user by email', { error, email });
      return callback(error);
    }

    return callback(null, _.first(user));
  });
}

function insertUser(options, callback) {
  const sql = `INSERT INTO users (email, first_name, last_name, password)
               VALUES (?, ?, ?, ?)`;
  const params = [options.email, options.firstName, options.lastName, options.password];

  db.executeQueryWithParams(sql, params, (error, results) => {
    if (error) {
      log.error('insertUser', 'error adding new user', { error, email: options.email });
      return callback(error);
    }

    return callback(null, results.insertId);
  });
}

function getUserById(id, callback) {
  const sql = `SELECT * FROM users WHERE id = ?`;
  const params = [id];

  db.executeQueryWithParams(sql, params, (error, user) => {
    if (error) {
      log.error('getUserById', 'error getting user by ID', { error, id });
      return callback(error);
    }

    return callback(null, _.first(user));
  });
}

export default {
  getUserByEmail,
  getUserById,
  insertUser,
};
