import { log } from './logger.js';

/**
 * Express error handling middleware
 *
 * Catches errors from all routes and sends appropriate responses.
 * Automatically called if any route passes an error to next(err).
 *
 * Usage in routes:
 *   try {
 *     // code
 *   } catch (err) {
 *     next(err);  // Pass to error handler
 *   }
 *
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export const errorHandler = (err, req, res, next) => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const timestamp = new Date().toISOString();

  // Determine error status code (default to 500)
  let statusCode = err.statusCode || err.status || 500;
  let errorMessage = err.message || 'Internal Server Error';

  // Validation and calculation errors should return 400
  if (
    err.name === 'ValidationError' ||
    err.name === 'TokenizationError' ||
    err.name === 'SyntaxError' ||
    err.name === 'ParseError' ||
    err.name === 'CalculationError' ||
    err.statusCode === 400
  ) {
    statusCode = 400;
    errorMessage = err.message || 'Invalid request';
  }

  // JSON parse errors
  if (err instanceof SyntaxError && err.body !== undefined) {
    statusCode = 400;
    errorMessage = 'Invalid JSON in request body';
  }

  // Log the error
  const logData = {
    timestamp,
    method: req.method,
    path: req.path,
    status: statusCode,
    message: errorMessage,
    url: req.originalUrl,
  };

  if (NODE_ENV === 'development') {
    log.error('Request error:', logData, err.stack);
  } else {
    log.error('Request error:', logData);
  }

  // Prepare response
  const response = {
    error: errorMessage,
    status: statusCode,
    timestamp,
  };

  // Add request ID if available (for tracking)
  if (req.id) {
    response.requestId = req.id;
  }

  // Include stack trace only in development
  if (NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack.split('\n').map(line => line.trim());
  }

  res.status(statusCode).json(response);
};

/**
 * Wrapper for route handlers to catch async errors
 *
 * Usage:
 *   app.get('/api/route', catchAsync(async (req, res) => {
 *     // code
 *   }));
 *
 * @param {Function} fn - Async route handler
 * @returns {Function} Express middleware
 */
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Create a custom error object for API responses
 *
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {string} code - Error code for client handling
 * @returns {Error} Error object with additional properties
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

/**
 * Validation error for invalid calculator expressions
 */
export class ValidationError extends ApiError {
  constructor(message, position = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.position = position;
    this.name = 'ValidationError';
  }
}

/**
 * Parser/syntax error in expression
 */
export class ParseError extends ApiError {
  constructor(message, position = null, context = null) {
    super(message, 400, 'PARSE_ERROR');
    this.position = position;
    this.context = context;
    this.name = 'ParseError';
  }
}

/**
 * Calculation error (e.g., division by zero)
 */
export class CalculationError extends ApiError {
  constructor(message, expression = null) {
    super(message, 400, 'CALCULATION_ERROR');
    this.expression = expression;
    this.name = 'CalculationError';
  }
}
