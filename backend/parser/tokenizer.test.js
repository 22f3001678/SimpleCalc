/**
 * Simple test file to verify tokenizer implementation
 * This tests Tasks 3.1-3.5
 */

import { Tokenizer, tokenize } from './tokenizer.js';
import { validateTokens } from './validator.js';
import { TokenType } from './tokens.js';
import { formatNumber, runNumericLiteralTests } from './numeric-literals.js';

// Test cases
const testExpressions = [
  // Simple arithmetic
  '5 + 3',
  '10 - 2',
  '3 * 4',
  '15 / 3',

  // With decimals
  '3.14 + 2.86',
  '0.5 * 4',

  // Scientific notation
  '1e3 + 5',
  '1.5e-2',

  // Functions
  'sin(π/2)',
  'cos(0)',
  'sqrt(16)',
  'log(100)',
  'ln(e)',

  // Complex expressions
  '(5 + 3) * 2',
  '2 ^ 3 ^ 2',
  'sin(π) + cos(0)',

  // Constants
  'π + e',
  '2 * π',

  // Factorial
  '5!',
  '(3+2)!',
];

const errorExpressions = [
  '5 +',           // Missing operand
  '* 3',           // Missing left operand
  'sin()',         // Empty function arguments
  '(5 + 3',        // Unmatched paren
  '5 3',           // Missing operator
  'unknown(x)',    // Unknown function
];

/**
 * Test a single expression
 */
function testExpression(expr) {
  try {
    const tokenStream = tokenize(expr);
    const tokens = [];
    while (!tokenStream.isAtEnd()) {
      tokens.push(tokenStream.next());
    }

    // Validate token sequence
    validateTokens(tokens, expr);

    console.log(`✓ ${expr}`);
    return true;
  } catch (err) {
    console.log(`✗ ${expr}`);
    console.log(`  Error: ${err.message}`);
    return false;
  }
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log('═'.repeat(60));
  console.log('TOKENIZER TESTS (Tasks 3.1-3.5)');
  console.log('═'.repeat(60));
  console.log();

  // Test valid expressions
  console.log('Valid Expressions:');
  console.log('-'.repeat(60));
  let validPassed = 0;
  for (const expr of testExpressions) {
    if (testExpression(expr)) validPassed++;
  }
  console.log(`Result: ${validPassed}/${testExpressions.length} passed\n`);

  // Test invalid expressions (should fail)
  console.log('Invalid Expressions (should fail):');
  console.log('-'.repeat(60));
  let invalidPassed = 0;
  for (const expr of errorExpressions) {
    try {
      testExpression(expr);
      console.log(`✗ "${expr}" - should have failed but didn't`);
    } catch (err) {
      console.log(`✓ "${expr}" - correctly rejected`);
      invalidPassed++;
    }
  }
  console.log(`Result: ${invalidPassed}/${errorExpressions.length} correctly rejected\n`);

  // Test numeric literals
  console.log('Numeric Literal Tests:');
  console.log('-'.repeat(60));
  const numResults = runNumericLiteralTests();
  console.log();

  // Overall results
  console.log('═'.repeat(60));
  console.log('OVERALL RESULTS');
  console.log('═'.repeat(60));
  console.log(`Valid expressions:     ${validPassed}/${testExpressions.length}`);
  console.log(`Invalid expressions:   ${invalidPassed}/${errorExpressions.length}`);
  console.log(`Numeric literals:      ${numResults.passed}/${numResults.total}`);
  console.log();

  const allPassed = validPassed === testExpressions.length &&
                   invalidPassed === errorExpressions.length &&
                   numResults.failed === 0;

  if (allPassed) {
    console.log('✓ ALL TESTS PASSED');
  } else {
    console.log('✗ SOME TESTS FAILED');
  }
  console.log();
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export { testExpression, testExpressions, errorExpressions };
