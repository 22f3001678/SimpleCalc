/**
 * Custom error classes for parser and evaluator.
 * These errors are intentionally separate from Express middleware
 * so the parser/evaluator layer remains self-contained.
 */

export class ValidationError extends Error {
  constructor(message, position = null, context = null) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.position = position;
    this.context = context;
  }
}

export class ParseError extends Error {
  constructor(message, position = null, context = null) {
    super(message);
    this.name = 'ParseError';
    this.statusCode = 400;
    this.position = position;
    this.context = context;
  }
}

export class CalculationError extends Error {
  constructor(message, position = null, context = null) {
    super(message);
    this.name = 'CalculationError';
    this.statusCode = 400;
    this.position = position;
    this.context = context;
  }
}
