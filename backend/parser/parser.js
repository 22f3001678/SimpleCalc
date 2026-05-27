import { TokenType, Token } from './tokens.js';
import { ParseError } from './errors.js';

/**
 * Recursive parser for mathematical expressions.
 * Builds an AST from the validated token stream.
 */
export class Parser {
  constructor(tokenStream, originalExpression = '') {
    this.tokenStream = tokenStream;
    this.originalExpression = originalExpression;
  }

  parse() {
    const ast = this.parseExpression(0);

    if (this.peek().type !== TokenType.EOF) {
      const token = this.peek();
      throw new ParseError(
        `Unexpected token '${token.value || token.type}' after expression`,
        token.position,
        token
      );
    }

    return ast;
  }

  parseExpression(minPrecedence = 0) {
    let left = this.parseUnary();

    while (true) {
      const token = this.peek();
      const isImplicit = this.isImplicitMultiplication(token, left);
      const isOperator = token.isBinaryOperator();
      let precedence = null;
      let operatorToken = null;

      if (isImplicit) {
        precedence = 2; // implicit multiplication has the same precedence as explicit '*'
        operatorToken = new Token(TokenType.MULTIPLY, '*', token.position, 0);
      } else if (isOperator) {
        precedence = token.getPrecedence();
        operatorToken = this.next();
      } else {
        break;
      }

      if (precedence < minPrecedence) {
        if (isOperator) {
          this.backtrack();
        }
        break;
      }

      const nextMinPrecedence = operatorToken.isRightAssociative()
        ? precedence
        : precedence + 1;

      const right = this.parseExpression(nextMinPrecedence);
      left = {
        type: 'BinaryExpression',
        operator: operatorToken.type,
        left,
        right,
      };
    }

    return left;
  }

  parseUnary() {
    const token = this.peek();

    if (token.type === TokenType.MINUS) {
      this.next();
      return {
        type: 'UnaryExpression',
        operator: 'NEGATE',
        operand: this.parseUnary(),
      };
    }

    if (token.isFunction()) {
      this.next();
      this.expect(TokenType.LPAREN, `Function '${token.value}' requires opening '('`);
      const argument = this.parseExpression(0);
      this.expect(TokenType.RPAREN, `Function '${token.value}' requires closing ')'`);

      return {
        type: 'FunctionCall',
        name: token.type,
        argument,
      };
    }

    return this.parsePrimary();
  }

  parsePrimary() {
    const token = this.peek();

    if (token.type === TokenType.NUMBER) {
      this.next();
      return this.parsePostfix({
        type: 'NumberLiteral',
        value: token.value,
        position: token.position,
      });
    }

    if (token.isConstant()) {
      this.next();
      return this.parsePostfix({
        type: 'ConstantLiteral',
        name: token.type,
        value: token.value,
        position: token.position,
      });
    }

    if (token.type === TokenType.LPAREN) {
      this.next();
      const expression = this.parseExpression(0);
      this.expect(TokenType.RPAREN, 'Missing closing parenthesis');
      return this.parsePostfix(expression);
    }

    throw new ParseError(
      `Unexpected token '${token.value || token.type}'`,
      token.position,
      token
    );
  }

  parsePostfix(node) {
    while (this.peek().type === TokenType.FACTORIAL) {
      const token = this.next();
      node = {
        type: 'UnaryExpression',
        operator: 'FACTORIAL',
        operand: node,
        position: token.position,
      };
    }

    return node;
  }

  isImplicitMultiplication(token, left) {
    if (!left || token.type === TokenType.EOF || token.type === TokenType.RPAREN) {
      return false;
    }

    return (
      token.type === TokenType.NUMBER ||
      token.isConstant() ||
      token.isFunction() ||
      token.type === TokenType.LPAREN
    );
  }

  expect(type, message) {
    const token = this.next();
    if (token.type !== type) {
      throw new ParseError(
        message || `Expected '${type}' but found '${token.type}'`,
        token.position,
        token
      );
    }
    return token;
  }

  peek() {
    return this.tokenStream.peek();
  }

  next() {
    return this.tokenStream.next();
  }

  backtrack() {
    if (this.tokenStream.position > 0) {
      this.tokenStream.position -= 1;
    }
  }
}
