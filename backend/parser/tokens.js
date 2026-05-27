/**
 * Token types for the mathematical expression tokenizer
 *
 * Each token represents a discrete unit in a mathematical expression:
 * - Numbers: 42, 3.14, 1e-5
 * - Operators: +, -, *, /, ^, %, !
 * - Functions: sin, cos, sqrt, log, etc.
 * - Constants: π, e
 * - Delimiters: (, )
 * - Special: EOF (end of input)
 */

export const TokenType = {
  // Numeric literals
  NUMBER: 'NUMBER',

  // Binary operators
  PLUS: 'PLUS',              // +
  MINUS: 'MINUS',            // -
  MULTIPLY: 'MULTIPLY',      // *
  DIVIDE: 'DIVIDE',          // /
  POWER: 'POWER',            // ^
  MODULO: 'MODULO',          // %

  // Unary operators
  FACTORIAL: 'FACTORIAL',    // !

  // Trigonometric functions
  SIN: 'SIN',                // sin
  COS: 'COS',                // cos
  TAN: 'TAN',                // tan
  ASIN: 'ASIN',              // asin
  ACOS: 'ACOS',              // acos
  ATAN: 'ATAN',              // atan

  // Logarithmic functions
  LOG: 'LOG',                // log (base 10)
  LN: 'LN',                  // ln (natural log)

  // Other functions
  SQRT: 'SQRT',              // sqrt
  ABS: 'ABS',                // abs

  // Constants
  CONSTANT_PI: 'CONSTANT_PI',   // π or pi
  CONSTANT_E: 'CONSTANT_E',     // e (when alone, not a function)

  // Delimiters
  LPAREN: 'LPAREN',          // (
  RPAREN: 'RPAREN',          // )

  // Special
  EOF: 'EOF',                // End of input
};

/**
 * Token class represents a single token
 */
export class Token {
  /**
   * Create a token
   * @param {string} type - TokenType (see TokenType object above)
   * @param {string|number} value - The actual value (e.g., "42" for NUMBER, "sin" for SIN)
   * @param {number} position - Position in the original expression
   * @param {number} length - Length of token in the original expression
   */
  constructor(type, value, position = 0, length = 0) {
    this.type = type;
    this.value = value;
    this.position = position;
    this.length = length;
  }

  /**
   * Human-readable representation for debugging
   */
  toString() {
    return `Token(${this.type}, ${this.value}, pos=${this.position})`;
  }

  /**
   * Check if this is a binary operator (needs left and right operands)
   */
  isBinaryOperator() {
    return [
      TokenType.PLUS,
      TokenType.MINUS,
      TokenType.MULTIPLY,
      TokenType.DIVIDE,
      TokenType.POWER,
      TokenType.MODULO,
    ].includes(this.type);
  }

  /**
   * Check if this is a unary operator (prefix or postfix)
   */
  isUnaryOperator() {
    return [TokenType.FACTORIAL].includes(this.type);
  }

  /**
   * Check if this is a function
   */
  isFunction() {
    return [
      TokenType.SIN,
      TokenType.COS,
      TokenType.TAN,
      TokenType.ASIN,
      TokenType.ACOS,
      TokenType.ATAN,
      TokenType.LOG,
      TokenType.LN,
      TokenType.SQRT,
      TokenType.ABS,
    ].includes(this.type);
  }

  /**
   * Check if this is a constant
   */
  isConstant() {
    return [TokenType.CONSTANT_PI, TokenType.CONSTANT_E].includes(this.type);
  }

  /**
   * Check if this is a number literal
   */
  isNumber() {
    return this.type === TokenType.NUMBER;
  }

  /**
   * Get operator precedence (higher = higher precedence)
   * Used in recursive descent parser for correct evaluation order
   *
   * Precedence levels:
   * 1 (lowest): + -
   * 2: * / %
   * 3 (highest): ^ (exponentiation, right-associative)
   */
  getPrecedence() {
    switch (this.type) {
      case TokenType.PLUS:
      case TokenType.MINUS:
        return 1;
      case TokenType.MULTIPLY:
      case TokenType.DIVIDE:
      case TokenType.MODULO:
        return 2;
      case TokenType.POWER:
        return 3;
      default:
        return 0;
    }
  }

  /**
   * Check if operator is right-associative
   * Power (^) is right-associative: 2^3^4 = 2^(3^4) = 2^81
   * Other operators are left-associative
   */
  isRightAssociative() {
    return this.type === TokenType.POWER;
  }
}

/**
 * Token stream for easy navigation
 */
export class TokenStream {
  constructor(tokens = []) {
    this.tokens = tokens;
    this.position = 0;
  }

  /**
   * Get current token without advancing
   */
  peek() {
    return this.position < this.tokens.length
      ? this.tokens[this.position]
      : new Token(TokenType.EOF, '', this.position);
  }

  /**
   * Get next token and advance position
   */
  next() {
    const token = this.peek();
    if (this.position < this.tokens.length) {
      this.position++;
    }
    return token;
  }

  /**
   * Check if we're at end of stream
   */
  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  /**
   * Skip tokens of a specific type
   */
  skipWhitespace() {
    // Note: whitespace is already stripped by tokenizer
    // This method is here for future expansion
  }

  /**
   * Reset to beginning
   */
  reset() {
    this.position = 0;
  }

  /**
   * Get remaining tokens
   */
  remaining() {
    return this.tokens.length - this.position;
  }

  /**
   * Human-readable representation
   */
  toString() {
    return `TokenStream(${this.tokens.map(t => t.toString()).join(', ')})`;
  }
}
