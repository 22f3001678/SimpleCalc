import { tokenize } from '../parser/tokenizer.js';
import { TokenValidator } from '../parser/validator.js';
import { Parser } from '../parser/parser.js';
import { evaluateAst } from '../parser/evaluator.js';
import { CalculationError } from '../parser/errors.js';

const DEFAULT_DECIMAL_PLACES = 10;
const OUTPUT_PRECISION = 12;

function formatResult(value) {
  if (!Number.isFinite(value)) {
    throw new CalculationError('Evaluation produced a non-finite result');
  }
  return Number(value.toPrecision(OUTPUT_PRECISION));
}

export const calculateHandler = async (req, res) => {
  const expression = req.expression;

  const tokenStream = tokenize(expression);
  const validator = new TokenValidator(tokenStream.tokens, expression);
  validator.validate();

  const parser = new Parser(tokenStream, expression);
  const ast = parser.parse();
  const rawResult = evaluateAst(ast);
  const result = formatResult(rawResult);

  res.json({
    expression,
    result,
    rawResult,
    precision: DEFAULT_DECIMAL_PLACES,
  });
};
