import winston from 'winston';

import config from 'config';

const LOG_PATH = `${config.paths.rootDir}/logs/logs.json`;


// winston config
winston.loggers.add(config.logs.mainLogger, {
  console: {
    colorize: true,
    prettyPrint: true,
    humanReadableUnhandledException: true
  },

  file: {
    json: true,
    timestamp: true,
    filename: LOG_PATH
  }
});

/*
 * Logger Class
 *
 * instantiate this class to create a new logger instance
 * should have 1:1 relationship with file (1 logger instance per file)
 *
 */
class Logger {
  constructor(fileName) {
    if (!fileName)
      throw new Error('forgot to include a filename in the logger instance!');

    this.fileName = fileName;
    this.logger = winston.loggers.get(config.logs.mainLogger);
  }

  info(fnName, msg, meta) {
    if (!meta)
      meta = {};

    const fullMsg = this.makeFullMsg(fnName, msg);
    this.logger.info(fullMsg, meta);
  }

  debug(fnName, msg, meta) {
    if (!meta)
      meta = {};

    const fullMsg = this.makeFullMsg(fnName, msg);
    this.logger.debug(fullMsg, meta);
  }

  warn(fnName, msg, meta) {
    if (!meta)
      meta = {};

    const fullMsg = this.makeFullMsg(fnName, msg);
    this.logger.warn(fullMsg, meta);
  }

  error(fnName, msg, meta) {
    if (!meta)
      meta = {};

    if (meta.error) {
      meta.stack = meta.error.stack.split('\n');
      meta.error = meta.error.message;
    }

    const fullMsg = this.makeFullMsg(fnName, msg, meta);
    this.logger.error(fullMsg, meta);
  }

  makeFullMsg(fnName, msg, meta) {
    return `${this.fileName}.${fnName}: ${msg}`;
  }
}

export default Logger;