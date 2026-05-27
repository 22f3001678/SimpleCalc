/**
 * Tokenizer validation and error handling
 *
 * Provides additional validation beyond the tokenizer itself:
 * - Balanced parentheses
 * - Valid token sequences (e.g., can't have two operators in a row)
 * - Clear, actionable error messages
 */

import { TokenType } from './tokens.js';
import { ValidationError } from './errors.js';

/**
 * Validator for token sequences
 *
 * Checks that the sequence of tokens makes sense mathematically
 * without attempting to parse the full expression
 */
export class TokenValidator {
  constructor(tokens, originalExpression = '') {
    this.tokens = tokens;
    this.originalExpression = originalExpression;
    this.errors = [];
  }

  /**
   * Run all validations
   * @returns {boolean} true if all validations pass, false otherwise
   * @throws {ValidationError} On first critical error
   */
  validate() {
    // Remove EOF token for validation
    const validTokens = this.tokens.filter(t => t.type !== TokenType.EOF);

    if (validTokens.length === 0) {
      throw new ValidationError('Empty expression');
    }

    // Run validations
    this.checkBalancedParentheses(validTokens);
    this.checkValidSequence(validTokens);
    this.checkOperatorPlacement(validTokens);
    this.checkFunctionSyntax(validTokens);

    return this.errors.length === 0;
  }

  /**
   * Check that parentheses are balanced
   * @throws {ValidationError}
   */
  checkBalancedParentheses(tokens) {
    let parenCount = 0;
    let lastOpenParen = -1;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === TokenType.LPAREN) {
        parenCount++;
        lastOpenParen = i;
      } else if (token.type === TokenType.RPAREN) {
        parenCount--;
        if (parenCount < 0) {
          throw new ValidationError(
            `Unmatched closing parenthesis at position ${token.position}`,
            token.position
          );
        }
      }
    }

    if (parenCount > 0) {
      const token = tokens[lastOpenParen];
      throw new ValidationError(
        `Unclosed opening parenthesis at position ${token.position}`,
        token.position
      );
    }
  }

  /**
   * Check valid token sequences
   * Prevents nonsensical sequences like: (+ 5) or 3 3 or ) 5 (
   * @throws {ValidationError}
   */
  checkValidSequence(tokens) {
    for (let i = 0; i < tokens.length; i++) {
      const current = tokens[i];
      const prev = i > 0 ? tokens[i - 1] : null;
      const next = i < tokens.length - 1 ? tokens[i + 1] : null;

      // First token cannot be: closing paren, operator (except - for negation), factorial
      if (i === 0) {
        if (current.type === TokenType.RPAREN) {
          throw new ValidationError(
            `Expression cannot start with ')'`,
            current.position
          );
        }
        if (current.type === TokenType.FACTORIAL) {
          throw new ValidationError(
            `Expression cannot start with '!'`,
            current.position
          );
        }
        if (current.isBinaryOperator() && current.type !== TokenType.MINUS) {
          throw new ValidationError(
            `Expression cannot start with '${current.value}'`,
            current.position
          );
        }
      }

      // Last token cannot be: opening paren, operator, factorial (standalone)
      if (i === tokens.length - 1) {
        if (current.type === TokenType.LPAREN) {
          throw new ValidationError(
            `Expression cannot end with '('`,
            current.position
          );
        }
        if (current.isBinaryOperator()) {
          throw new ValidationError(
            `Expression cannot end with operator '${current.value}'`,
            current.position
          );
        }
        if (current.isFunction()) {
          throw new ValidationError(
            `Function '${current.value}' requires arguments`,
            current.position
          );
        }
      }

      // Check for consecutive operators (with exceptions)
      if (current.isBinaryOperator() && prev && prev.isBinaryOperator()) {
        // Exception: -- can be double negative, +- is okay, etc.
        if (!(current.type === TokenType.MINUS && prev.type === TokenType.MINUS)) {
          throw new ValidationError(
            `Cannot have two operators in a row: '${prev.value}${current.value}'`,
            current.position
          );
        }
      }

      // Function must be followed by opening paren
      if (current.isFunction()) {
        if (!next || next.type !== TokenType.LPAREN) {
          throw new ValidationError(
            `Function '${current.value}' must be followed by '('`,
            current.position
          );
        }
      }

      // After closing paren, can only have: operator, closing paren, EOF
      // Implicit multiplication after ')' is allowed for cases like '(2)(3)' or '(1+2)π'
      if (current.type === TokenType.RPAREN && next) {
        if (next.type === TokenType.NUMBER || next.isConstant() || next.isFunction() || next.type === TokenType.LPAREN) {
          continue;
        }
      }

      // After number/constant, can only have: operator, closing paren, EOF
      if ((current.type === TokenType.NUMBER || current.isConstant()) && next) {
        if (next.type === TokenType.NUMBER || (next.isConstant() && next.type !== TokenType.FACTORIAL) ||
            next.isFunction() || next.type === TokenType.LPAREN) {
          // Check if we need to infer multiplication (implicit multiplication)
          // This will be handled in the parser, so just warn
          if (next.isConstant() || next.isFunction() || next.type === TokenType.LPAREN) {
            // Implicit multiplication is allowed
            continue;
          }
          throw new ValidationError(
            `Missing operator between '${current.value}' and '${next.value || next.type}'`,
            next.position
          );
        }
      }
    }
  }

  /**
   * Check operator placement validity
   */
  checkOperatorPlacement(tokens) {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const prev = i > 0 ? tokens[i - 1] : null;
      const next = i < tokens.length - 1 ? tokens[i + 1] : null;

      // Binary operators need operands on both sides
      if (token.isBinaryOperator()) {
        // Special case: minus can be unary (negation)
        if (token.type === TokenType.MINUS) {
          if (!prev || prev.type === TokenType.LPAREN || prev.isBinaryOperator()) {
            // This is unary minus, which is okay
            continue;
          }
        }

        // Binary operator needs left operand
        if (!prev || !this.isValidLeftOperand(prev)) {
          throw new ValidationError(
            `Operator '${token.value}' requires left operand`,
            token.position
          );
        }

        // Binary operator needs right operand
        if (!next || !this.isValidRightOperand(next)) {
          throw new ValidationError(
            `Operator '${token.value}' requires right operand`,
            token.position
          );
        }
      }

      // Factorial is postfix
      if (token.type === TokenType.FACTORIAL) {
        if (!prev || !this.isValidLeftOperand(prev)) {
          throw new ValidationError(
            `Factorial '!' requires a number before it`,
            token.position
          );
        }
      }
    }
  }

  /**
   * Check function call syntax
   */
  checkFunctionSyntax(tokens) {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.isFunction()) {
        const next = tokens[i + 1];
        if (!next || next.type !== TokenType.LPAREN) {
          throw new ValidationError(
            `Function '${token.value}' must be followed by '('`,
            token.position
          );
        }

        // Find matching closing paren
        let parenCount = 1;
        let j = i + 2;
        while (j < tokens.length && parenCount > 0) {
          if (tokens[j].type === TokenType.LPAREN) parenCount++;
          if (tokens[j].type === TokenType.RPAREN) parenCount--;
          j++;
        }

        if (parenCount !== 0) {
          throw new ValidationError(
            `Unmatched parenthesis in function call '${token.value}(...)'`,
            token.position
          );
        }
      }
    }
  }

  /**
   * Check if token can be a left operand
   */
  isValidLeftOperand(token) {
    return token.type === TokenType.NUMBER ||
           token.type === TokenType.RPAREN ||
           token.isConstant() ||
           token.type === TokenType.FACTORIAL;
  }

  /**
   * Check if token can be a right operand
   */
  isValidRightOperand(token) {
    return token.type === TokenType.NUMBER ||
           token.type === TokenType.LPAREN ||
           token.isFunction() ||
           token.isConstant() ||
           (token.type === TokenType.MINUS); // Unary minus
  }

  /**
   * Add error to list
   */
  addError(message, position) {
    this.errors.push({ message, position });
  }

  /**
   * Get error messages
   */
  getErrors() {
    return this.errors;
  }
}

/**
 * Convenience function to validate tokens
 * @param {Token[]} tokens - Array of tokens
 * @param {string} originalExpression - Original expression string (for context)
 * @returns {boolean} true if valid
 * @throws {ValidationError} If validation fails
 */
export function validateTokens(tokens, originalExpression = '') {
  const validator = new TokenValidator(tokens, originalExpression);
  return validator.validate();
}
