import { ValidationError } from '../parser/errors.js';

export const validateExpression = (req, res, next) => {
  const expression = req.body?.expression;

  if (typeof expression !== 'string' || expression.trim().length === 0) {
    throw new ValidationError('Request body must include a non-empty expression string');
  }

  req.expression = expression.trim();
  next();
};
