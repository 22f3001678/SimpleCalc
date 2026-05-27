/**
 * Tokenizer (Lexical Analyzer)
 *
 * Converts a mathematical expression string into a sequence of tokens.
 * This is the first stage of the parser pipeline:
 *   Input: "5 + 3 * sin(π/2)"
 *   Output: [Token(NUMBER, 5), Token(PLUS, '+'), Token(NUMBER, 3), ...]
 *
 * Security: Uses whitelist validation - only allows known characters
 */

import {
  Token,
  TokenType,
  TokenStream,
} from './tokens.js';

import {
  BINARY_OPERATORS,
  UNARY_OPERATORS,
  FUNCTIONS,
  CONSTANTS,
  DELIMITERS,
  ALLOWED_CHARACTERS,
  isLetter,
  isDigit,
  isWhitespace,
  getTokenType,
  getConstantValue,
} from './whitelist.js';

/**
 * Custom error for tokenization failures
 */
export class TokenizationError extends Error {
  constructor(message, position = null, context = null) {
    super(message);
    this.name = 'TokenizationError';
    this.position = position;
    this.context = context;
  }
}

/**
 * Tokenizer class
 *
 * Usage:
 *   const tokenizer = new Tokenizer("5 + 3");
 *   const tokens = tokenizer.tokenize();
 *   // tokens = [Token(NUMBER, 5), Token(PLUS, '+'), Token(NUMBER, 3), Token(EOF, '')]
 */
export class Tokenizer {
  constructor(expression = '', options = {}) {
    this.input = expression;
    this.position = 0;
    this.tokens = [];

    // Configuration
    this.maxLength = options.maxLength || 1000;
    this.validateCharacters = options.validateCharacters !== false;
  }

  /**
   * Main tokenization method
   * @returns {TokenStream} Stream of tokens
   * @throws {TokenizationError} If input is invalid
   */
  tokenize() {
    // Validate input
    this.validateInput();

    // Tokenize
    while (!this.isAtEnd()) {
      this.skipWhitespace();

      if (this.isAtEnd()) break;

      const token = this.nextToken();
      if (token) {
        this.tokens.push(token);
      }
    }

    // Add EOF marker
    this.tokens.push(new Token(TokenType.EOF, '', this.position, 0));

    return new TokenStream(this.tokens);
  }

  /**
   * Validate input before tokenization
   * @throws {TokenizationError} If input is invalid
   */
  validateInput() {
    // Check length
    if (this.input.length > this.maxLength) {
      throw new TokenizationError(
        `Expression exceeds maximum length of ${this.maxLength} characters`,
        0
      );
    }

    // Check for empty input
    if (this.input.trim().length === 0) {
      throw new TokenizationError(
        'Empty expression',
        0
      );
    }

    // Check for invalid characters
    if (this.validateCharacters) {
      this.validateCharacterSet();
    }
  }

  /**
   * Validate that all characters are in the allowed set
   * @throws {TokenizationError} If forbidden character found
   */
  validateCharacterSet() {
    for (let i = 0; i < this.input.length; i++) {
      const char = this.input[i];

      if (!ALLOWED_CHARACTERS.has(char)) {
        throw new TokenizationError(
          `Invalid character '${char}' at position ${i}`,
          i,
          this.getContext(i)
        );
      }
    }
  }

  /**
   * Get context around a position (for error messages)
   */
  getContext(pos, contextLength = 10) {
    const start = Math.max(0, pos - contextLength);
    const end = Math.min(this.input.length, pos + contextLength + 1);
    const before = this.input.substring(start, pos);
    const char = this.input[pos] || '';
    const after = this.input.substring(pos + 1, end);

    return `${before}[${char}]${after}`;
  }

  /**
   * Check if we're at end of input
   */
  isAtEnd() {
    return this.position >= this.input.length;
  }

  /**
   * Peek at current character without advancing
   */
  peek() {
    return this.isAtEnd() ? '' : this.input[this.position];
  }

  /**
   * Peek ahead n characters
   */
  peekAhead(n = 1) {
    const pos = this.position + n;
    return pos >= this.input.length ? '' : this.input[pos];
  }

  /**
   * Advance position and return current character
   */
  advance() {
    return this.input[this.position++];
  }

  /**
   * Skip whitespace characters
   */
  skipWhitespace() {
    while (!this.isAtEnd() && isWhitespace(this.peek())) {
      this.advance();
    }
  }

  /**
   * Tokenize the next element
   */
  nextToken() {
    const startPos = this.position;
    const char = this.peek();

    // Try to parse different token types in order

    // 1. Try number literal (including decimals and scientific notation)
    if (isDigit(char) || (char === '.' && isDigit(this.peekAhead()))) {
      return this.readNumber(startPos);
    }

    // 2. Try identifier (function, constant, or variable)
    if (isLetter(char)) {
      return this.readIdentifier(startPos);
    }

    // 3. Try delimiters
    if (char in DELIMITERS) {
      this.advance();
      return new Token(DELIMITERS[char], char, startPos, 1);
    }

    // 4. Try operators (binary or unary)
    if (char in BINARY_OPERATORS || char in UNARY_OPERATORS) {
      this.advance();
      const op = char in BINARY_OPERATORS ? BINARY_OPERATORS[char] : UNARY_OPERATORS[char];
      return new Token(op, char, startPos, 1);
    }

    // If we get here, it's an unexpected character
    throw new TokenizationError(
      `Unexpected character '${char}'`,
      this.position,
      this.getContext(this.position)
    );
  }

  /**
   * Read a numeric literal
   * Supports: integers, decimals, scientific notation
   * Examples: 42, 3.14, 1e-5, 2.5E3
   */
  readNumber(startPos) {
    let numStr = '';

    // Read digits before decimal point
    while (!this.isAtEnd() && isDigit(this.peek())) {
      numStr += this.advance();
    }

    // Read decimal point and digits after
    if (this.peek() === '.' && isDigit(this.peekAhead())) {
      numStr += this.advance(); // consume '.'
      while (!this.isAtEnd() && isDigit(this.peek())) {
        numStr += this.advance();
      }
    }

    // Read scientific notation (e or E)
    if (this.peek() === 'e' || this.peek() === 'E') {
      numStr += this.advance(); // consume 'e' or 'E'

      // Optional sign
      if (this.peek() === '+' || this.peek() === '-') {
        numStr += this.advance();
      }

      // Exponent digits
      if (!isDigit(this.peek())) {
        throw new TokenizationError(
          `Invalid scientific notation: expected digits after 'e'`,
          this.position,
          this.getContext(this.position)
        );
      }

      while (!this.isAtEnd() && isDigit(this.peek())) {
        numStr += this.advance();
      }
    }

    const value = parseFloat(numStr);

    // Validate parsed number
    if (isNaN(value)) {
      throw new TokenizationError(
        `Invalid number: ${numStr}`,
        startPos
      );
    }

    return new Token(
      TokenType.NUMBER,
      value,
      startPos,
      this.position - startPos
    );
  }

  /**
   * Read an identifier (function, constant, or variable)
   * Examples: sin, cos, pi, π, e
   *
   * Strategy:
   * 1. Try to match against FUNCTIONS (case-insensitive)
   * 2. Try to match against CONSTANTS (case-insensitive)
   * 3. If not whitelisted, throw error
   */
  readIdentifier(startPos) {
    let identStr = '';

    // Read identifier characters (letters and digits)
    while (!this.isAtEnd() && (isLetter(this.peek()) || isDigit(this.peek()))) {
      identStr += this.advance();
    }

    // Try to match against whitelist
    const lowerIdent = identStr.toLowerCase();

    // Check if it's a function
    if (lowerIdent in FUNCTIONS) {
      const tokenType = FUNCTIONS[lowerIdent];
      return new Token(tokenType, identStr, startPos, identStr.length);
    }

    // Check if it's a constant
    if (lowerIdent in CONSTANTS) {
      const tokenType = CONSTANTS[lowerIdent].tokenType;
      const value = CONSTANTS[lowerIdent].value;
      // Return as a constant token with the numeric value
      return new Token(tokenType, value, startPos, identStr.length);
    }

    // Not whitelisted
    throw new TokenizationError(
      `Unknown identifier '${identStr}'. ` +
      `Use function like sin(), cos(), or constant like π, e`,
      startPos,
      this.getContext(startPos)
    );
  }
}

/**
 * Convenience function to tokenize a string
 * @param {string} expression - Mathematical expression
 * @param {object} options - Options (maxLength, validateCharacters)
 * @returns {TokenStream} Stream of tokens
 * @throws {TokenizationError} If tokenization fails
 */
export function tokenize(expression, options = {}) {
  const tokenizer = new Tokenizer(expression, options);
  return tokenizer.tokenize();
}
