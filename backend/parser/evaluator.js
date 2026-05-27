import { CalculationError, ParseError } from './errors.js';

const FUNCTION_MAP = {
  SIN: (value) => Math.sin(value),
  COS: (value) => Math.cos(value),
  TAN: (value) => Math.tan(value),
  ASIN: (value) => {
    if (value < -1 || value > 1) {
      throw new CalculationError('asin argument must be between -1 and 1');
    }
    return Math.asin(value);
  },
  ACOS: (value) => {
    if (value < -1 || value > 1) {
      throw new CalculationError('acos argument must be between -1 and 1');
    }
    return Math.acos(value);
  },
  ATAN: (value) => Math.atan(value),
  LOG: (value) => {
    if (value <= 0) {
      throw new CalculationError('log argument must be greater than zero');
    }
    return Math.log10(value);
  },
  LN: (value) => {
    if (value <= 0) {
      throw new CalculationError('ln argument must be greater than zero');
    }
    return Math.log(value);
  },
  SQRT: (value) => {
    if (value < 0) {
      throw new CalculationError('sqrt argument must be greater than or equal to zero');
    }
    return Math.sqrt(value);
  },
  ABS: (value) => Math.abs(value),
};

export function evaluateAst(node) {
  if (!node || typeof node !== 'object') {
    throw new ParseError('AST node is invalid');
  }

  switch (node.type) {
    case 'NumberLiteral':
    case 'ConstantLiteral':
      return Number(node.value);

    case 'UnaryExpression': {
      const value = evaluateAst(node.operand);
      switch (node.operator) {
        case 'NEGATE':
          return -value;
        case 'FACTORIAL':
          return evaluateFactorial(value);
        default:
          throw new CalculationError(`Unknown unary operator '${node.operator}'`);
      }
    }

    case 'BinaryExpression': {
      const left = evaluateAst(node.left);
      const right = evaluateAst(node.right);
      return evaluateBinaryExpression(node.operator, left, right);
    }

    case 'FunctionCall': {
      const value = evaluateAst(node.argument);
      const fn = FUNCTION_MAP[node.name];
      if (!fn) {
        throw new CalculationError(`Unsupported function '${node.name}'`);
      }
      return fn(value);
    }

    default:
      throw new ParseError(`Unsupported AST node type '${node.type}'`);
  }
}

function evaluateBinaryExpression(operator, left, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new CalculationError('Invalid operand value');
  }

  switch (operator) {
    case 'PLUS':
      return left + right;
    case 'MINUS':
      return left - right;
    case 'MULTIPLY':
      return left * right;
    case 'DIVIDE':
      if (right === 0) {
        throw new CalculationError('Division by zero is not allowed');
      }
      return left / right;
    case 'POWER': {
      const result = Math.pow(left, right);
      if (!Number.isFinite(result)) {
        throw new CalculationError('Result is not a finite number');
      }
      return result;
    }
    case 'MODULO': {
      if (right === 0) {
        throw new CalculationError('Modulo by zero is not allowed');
      }
      return left % right;
    }
    default:
      throw new CalculationError(`Unknown binary operator '${operator}'`);
  }
}

function evaluateFactorial(value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new CalculationError('Factorial requires a non-negative integer');
  }

  if (value > 170) {
    throw new CalculationError('Factorial value is too large to calculate safely');
  }

  let result = 1;
  for (let i = 2; i <= value; i += 1) {
    result *= i;
  }

  return result;
}
