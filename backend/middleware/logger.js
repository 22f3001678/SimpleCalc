import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Simple logger utility for backend
 *
 * Provides consistent logging across the application with:
 * - Timestamp for each log entry
 * - Log level indicators (INFO, WARN, ERROR, DEBUG)
 * - Option to write to file in production
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const LEVEL_NAMES = {
  0: 'DEBUG',
  1: 'INFO',
  2: 'WARN',
  3: 'ERROR',
};

const LOG_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'INFO'];
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level name
 * @param {string} message - Log message
 * @param {any} data - Additional data
 * @returns {string} Formatted log string
 */
const formatLogMessage = (level, message, data) => {
  const timestamp = new Date().toISOString();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level}] ${message}${dataStr}`;
};

/**
 * Write log to file (for production)
 * @param {string} message - Formatted log message
 * @param {string} level - Log level
 */
const writeToFile = (message, level) => {
  if (NODE_ENV !== 'production') return;

  try {
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const filename = path.join(logsDir, `${level.toLowerCase()}.log`);
    fs.appendFileSync(filename, message + '\n');
  } catch (err) {
    console.error('Error writing to log file:', err.message);
  }
};

/**
 * Main logger object with methods for each log level
 */
export const log = {
  /**
   * Log debug message (lowest priority)
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  debug: (message, data) => {
    if (LOG_LEVEL <= LOG_LEVELS.DEBUG) {
      const formatted = formatLogMessage('DEBUG', message, data);
      console.debug(formatted);
      writeToFile(formatted, 'DEBUG');
    }
  },

  /**
   * Log info message (normal priority)
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  info: (message, data) => {
    if (LOG_LEVEL <= LOG_LEVELS.INFO) {
      const formatted = formatLogMessage('INFO', message, data);
      console.log(formatted);
      writeToFile(formatted, 'INFO');
    }
  },

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  warn: (message, data) => {
    if (LOG_LEVEL <= LOG_LEVELS.WARN) {
      const formatted = formatLogMessage('WARN', message, data);
      console.warn(formatted);
      writeToFile(formatted, 'WARN');
    }
  },

  /**
   * Log error message (highest priority)
   * @param {string} message - Log message
   * @param {any} data - Additional data
   * @param {string} stack - Stack trace (optional)
   */
  error: (message, data, stack) => {
    if (LOG_LEVEL <= LOG_LEVELS.ERROR) {
      const formatted = formatLogMessage('ERROR', message, data);
      console.error(formatted);
      if (stack) {
        console.error('Stack:', stack);
      }
      writeToFile(formatted + (stack ? '\nStack: ' + stack : ''), 'ERROR');
    }
  },
};

/**
 * Express middleware for request logging
 *
 * Logs:
 * - Request method and path
 * - Query parameters
 * - Response status and time
 * - Request/response size
 *
 * Usage in Express app:
 *   import { requestLogger } from './middleware/logger.js';
 *   app.use(requestLogger);
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const startMemory = process.memoryUsage().heapUsed;

  // Store original send method
  const originalSend = res.send;

  // Override send method to capture response
  res.send = function (data) {
    const duration = Date.now() - startTime;
    const memoryUsed = (process.memoryUsage().heapUsed - startMemory) / 1024;

    const logData = {
      method: req.method,
      path: req.path,
      query: Object.keys(req.query).length > 0 ? req.query : undefined,
      status: res.statusCode,
      durationMs: duration,
      memoryKb: memoryUsed.toFixed(2),
    };

    // Log based on status code
    if (res.statusCode >= 500) {
      log.error('Request completed', logData);
    } else if (res.statusCode >= 400) {
      log.warn('Request completed', logData);
    } else {
      log.info('Request completed', logData);
    }

    // Call original send method
    return originalSend.call(this, data);
  };

  // Log incoming request
  log.info('Request received', {
    method: req.method,
    path: req.path,
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
  });

  next();
};

/**
 * Development-only detailed request logger
 * Logs request body and headers in development
 */
export const detailedRequestLogger = (req, res, next) => {
  if (NODE_ENV === 'development') {
    log.debug('Request details', {
      headers: req.headers,
      body: req.body,
      ip: req.ip,
    });
  }
  next();
};
