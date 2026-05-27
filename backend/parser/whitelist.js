/**
 * Security whitelist for allowed mathematical operations
 *
 * This file defines exactly which operations, functions, and constants
 * are allowed in calculator expressions. All other inputs are rejected.
 *
 * Security principle: Explicit whitelist, not blacklist.
 * We specify what IS allowed, everything else is rejected.
 */

/**
 * Whitelist of allowed binary operators
 * Format: { symbol: TokenType }
 */
export const BINARY_OPERATORS = {
  '+': 'PLUS',
  '-': 'MINUS',
  '*': 'MULTIPLY',
  '/': 'DIVIDE',
  '^': 'POWER',
  '%': 'MODULO',
};

/**
 * Whitelist of allowed unary operators
 * Format: { symbol: TokenType }
 *
 * Note: These appear AFTER their operand (postfix)
 * Example: 5! = 120
 */
export const UNARY_OPERATORS = {
  '!': 'FACTORIAL',
};

/**
 * Whitelist of allowed mathematical functions
 * Format: { name: TokenType }
 *
 * Each function requires parentheses: sin(x), not sin x
 */
export const FUNCTIONS = {
  // Trigonometric (input in radians after mode conversion)
  sin: 'SIN',
  cos: 'COS',
  tan: 'TAN',
  asin: 'ASIN',     // arcsine
  acos: 'ACOS',     // arccosine
  atan: 'ATAN',     // arctangent

  // Logarithmic
  log: 'LOG',       // base 10
  ln: 'LN',         // natural log (base e)

  // Other
  sqrt: 'SQRT',     // square root
  abs: 'ABS',       // absolute value
};

/**
 * Whitelist of allowed mathematical constants
 * Format: { name: { tokenType, value } }
 *
 * These can appear as standalone tokens in expressions
 * Example: 2 * π = 2 * 3.14159...
 */
export const CONSTANTS = {
  pi: {
    tokenType: 'CONSTANT_PI',
    value: Math.PI,
    description: 'π (pi): approximately 3.14159265359',
  },
  π: {
    tokenType: 'CONSTANT_PI',
    value: Math.PI,
    description: 'π (pi): approximately 3.14159265359',
  },
  e: {
    tokenType: 'CONSTANT_E',
    value: Math.E,
    description: 'e (Euler\'s number): approximately 2.71828182846',
  },
};

/**
 * Special symbols and delimiters
 */
export const DELIMITERS = {
  '(': 'LPAREN',
  ')': 'RPAREN',
  '.': 'DOT',  // Decimal point (handled specially)
};

/**
 * Whitelist for single-character tokens
 * Used as first pass validation before detailed parsing
 */
export const ALLOWED_CHARACTERS = new Set([
  // Numbers
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  // Operators
  '+', '-', '*', '/', '^', '%', '!',
  // Delimiters
  '(', ')',
  // Decimal point
  '.',
  // Scientific notation
  'e', 'E',
  // Constants and functions (letters)
  'a', 'b', 'c', 'd', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  // Greek letter pi
  'π',
  // Whitespace (will be stripped)
  ' ', '\t', '\n', '\r',
]);

/**
 * Create lookup map for all allowed tokens
 * Used for quick validation
 */
export const ALL_OPERATORS = {
  ...BINARY_OPERATORS,
  ...UNARY_OPERATORS,
};

export const ALL_FUNCTIONS = FUNCTIONS;
export const ALL_CONSTANTS = CONSTANTS;

/**
 * Validate that a token string is in the whitelist
 *
 * @param {string} tokenStr - The token string to validate
 * @param {string} type - The expected type ('operator', 'function', 'constant')
 * @returns {boolean} true if token is in whitelist
 */
export function isWhitelisted(tokenStr, type) {
  switch (type) {
    case 'operator':
      return tokenStr in ALL_OPERATORS;
    case 'function':
      return tokenStr.toLowerCase() in ALL_FUNCTIONS;
    case 'constant':
      return tokenStr.toLowerCase() in ALL_CONSTANTS;
    case 'delimiter':
      return tokenStr in DELIMITERS;
    default:
      return false;
  }
}

/**
 * Get the TokenType for a whitelisted token
 *
 * @param {string} tokenStr - The token string
 * @param {string} type - The expected type ('operator', 'function', 'constant')
 * @returns {string|null} The TokenType constant or null
 */
export function getTokenType(tokenStr, type) {
  switch (type) {
    case 'operator': {
      return ALL_OPERATORS[tokenStr] || null;
    }
    case 'function': {
      const lower = tokenStr.toLowerCase();
      return ALL_FUNCTIONS[lower] || null;
    }
    case 'constant': {
      const lower = tokenStr.toLowerCase();
      return ALL_CONSTANTS[lower]?.tokenType || null;
    }
    case 'delimiter': {
      return DELIMITERS[tokenStr] || null;
    }
    default:
      return null;
  }
}

/**
 * Get the value for a constant
 *
 * @param {string} tokenStr - The constant name (e.g., 'pi', 'π', 'e')
 * @returns {number|null} The constant value or null
 */
export function getConstantValue(tokenStr) {
  const lower = tokenStr.toLowerCase();
  return ALL_CONSTANTS[lower]?.value || null;
}

/**
 * Check if a character could start a function or constant name
 * (i.e., is it a letter?)
 */
export function isLetter(char) {
  return /[a-zA-Zπ]/.test(char);
}

/**
 * Check if a character is a digit
 */
export function isDigit(char) {
  return /[0-9]/.test(char);
}

/**
 * Check if a character is whitespace
 */
export function isWhitespace(char) {
  return /[\s]/.test(char);
}

/**
 * Summary of security restrictions
 * Printed to help users understand what's allowed
 */
export const SECURITY_SUMMARY = `
SimpleCalc Security & Limitations:

ALLOWED:
  • Numbers: 0-9, decimal point (.), scientific notation (1e-5)
  • Operators: +, -, *, /, ^ (power), % (modulo), ! (factorial)
  • Parentheses: ( ) for grouping and function arguments
  • Functions: sin, cos, tan, asin, acos, atan, log (base 10), ln, sqrt, abs
  • Constants: π (or pi) and e

NOT ALLOWED (Blocked):
  • Programming constructs: no variables, loops, if statements
  • Dangerous functions: no eval(), system calls, file operations
  • Complex numbers: only real numbers supported
  • Symbolic computation: no algebra or calculus operations
  • User-defined functions: only built-ins allowed
  • Multi-line expressions: single expression only

EXECUTION:
  • No JavaScript eval() or Function() constructor
  • Safe tokenization + parsing + AST evaluation
  • Depth limit (max 50 nested operations)
  • Expression length limit (max 1000 characters)
  • Timeout protection (max 100ms per evaluation)
`;

export function printSecurity() {
  console.log(SECURITY_SUMMARY);
}
