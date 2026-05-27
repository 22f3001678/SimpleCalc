import { ValidationError } from '../parser/errors.js';

export const validateExpression = (req, res, next) => {
  const expression = req.body?.expression;
  const angleMode = req.body?.angleMode;

  if (typeof expression !== 'string' || expression.trim().length === 0) {
    throw new ValidationError('Request body must include a non-empty expression string');
  }

  if (angleMode && !['degrees', 'radians'].includes(angleMode)) {
    throw new ValidationError('angleMode must be either "degrees" or "radians"');
  }

  req.expression = expression.trim();
  req.angleMode = angleMode || 'radians';
  next();
};
