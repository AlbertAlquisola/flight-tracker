import mysql from 'mysql';
import config from 'config';
import Logger from 'util/Logger';

const log = new Logger('models/database');

const pool = mysql.createPool({
  connectionLimit: config.mysql.connLimit,
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.pass,
  database: config.mysql.db
});

const database = {
  getConnection: (callback) => {
    pool.getConnection((error, connection) => {
      callback(error, connection);
    });
  },

  executeQueryWithParams: (sql, params, callback) => {
    pool.getConnection((error, connection) => {
      if (error) {
        log.error('executeQueryWithParams', 'error getting db connection', { error });
        return callback(error);
      }

      connection.query(sql, params, (err, results) => {
        connection.release();

        return callback(err, results);
      });
    });
  },

  executeQuery: (sql, callback) => {
    pool.getConnection((error, connection) => {
      if (error) {
        log.error('executeQueryWithParams', 'error getting db connection', { error });
        return callback(error);
      }

      connection.query(sql, (err, results) => {
        connection.release();

        return callback(err, results);
      });
    });
  }
};

export default database;