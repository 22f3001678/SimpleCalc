import { tokenize } from './tokenizer.js';
import { TokenValidator } from './validator.js';
import { Parser } from './parser.js';
import { evaluateAst } from './evaluator.js';

function evaluateExpression(expression) {
  const tokenStream = tokenize(expression);
  const validator = new TokenValidator(tokenStream.tokens, expression);
  validator.validate();
  const ast = new Parser(tokenStream, expression).parse();
  return evaluateAst(ast);
}

describe('SimpleCalc parser and evaluator', () => {
  it('evaluates arithmetic with operator precedence', () => {
    expect(evaluateExpression('5 + 3 * 2')).toBe(11);
    expect(evaluateExpression('(5 + 3) * 2')).toBe(16);
    expect(evaluateExpression('2 ^ 3 ^ 2')).toBe(512);
  });

  it('supports decimal and scientific notation', () => {
    expect(evaluateExpression('3.5 + 1.5')).toBe(5);
    expect(evaluateExpression('1e2 + 5')).toBe(105);
  });

  it('evaluates functions and constants', () => {
    expect(evaluateExpression('sin(0)')).toBeCloseTo(0);
    expect(evaluateExpression('cos(0)')).toBeCloseTo(1);
    expect(evaluateExpression('sqrt(9)')).toBe(3);
    expect(evaluateExpression('log(100)')).toBeCloseTo(2);
    expect(evaluateExpression('ln(e)')).toBeCloseTo(1);
    expect(evaluateExpression('2 * π')).toBeCloseTo(2 * Math.PI);
  });

  it('handles implicit multiplication', () => {
    expect(evaluateExpression('2π')).toBeCloseTo(2 * Math.PI);
    expect(evaluateExpression('2(3 + 4)')).toBe(14);
    expect(evaluateExpression('(1 + 2)(3 + 4)')).toBe(21);
  });

  it('supports unary minus and factorial', () => {
    expect(evaluateExpression('-5 + 2')).toBe(-3);
    expect(evaluateExpression('5!')).toBe(120);
    expect(evaluateExpression('(-3 + 5)!')).toBe(2);
  });

  it('rejects invalid expressions', () => {
    expect(() => evaluateExpression('5 +')).toThrow();
    expect(() => evaluateExpression('sin()')).toThrow();
    expect(() => evaluateExpression('5 5')).toThrow();
  });
});
