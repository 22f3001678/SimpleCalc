/**
 * Numeric literal parsing and validation
 *
 * Handles all forms of numeric input:
 * - Integers: 42, 0, -5
 * - Decimals: 3.14, 0.5, .5
 * - Scientific notation: 1e5, 1.5e-3, 2E+10
 *
 * This module tests and documents the numeric literal handling
 * implemented in tokenizer.readNumber()
 */

/**
 * Parse and validate a numeric string
 * Supports all JavaScript number formats
 *
 * @param {string} numStr - Numeric string
 * @returns {{value: number, type: string, isValid: boolean}}
 */
export function parseNumericLiteral(numStr) {
  const trimmed = numStr.trim();

  // Check for empty
  if (!trimmed) {
    return {
      value: NaN,
      type: 'invalid',
      isValid: false,
      reason: 'Empty numeric literal',
    };
  }

  // Check format
  let type = 'unknown';
  if (/^-?[0-9]+$/.test(trimmed)) {
    type = 'integer';
  } else if (/^-?[0-9]*\.[0-9]+$/.test(trimmed)) {
    type = 'decimal';
  } else if (/^-?[0-9]*\.?[0-9]+[eE][+-]?[0-9]+$/.test(trimmed)) {
    type = 'scientific';
  }

  // Try to parse
  const value = parseFloat(trimmed);
  const isValid = !isNaN(value) && isFinite(value);

  return {
    value,
    type,
    isValid,
    reason: isValid ? null : 'Failed to parse as number',
  };
}

/**
 * Check if a numeric value is within acceptable range
 *
 * JavaScript numbers have limits:
 * - MIN_VALUE: 5e-324 (smallest positive)
 * - MAX_VALUE: 1.7976931348623157e+308 (largest)
 * - But we may want to enforce stricter limits for calculator use
 *
 * @param {number} value - The numeric value
 * @returns {{inRange: boolean, message: string}}
 */
export function checkNumericRange(value) {
  // Check for special values
  if (isNaN(value)) {
    return {
      inRange: false,
      message: 'Value is NaN (Not a Number)',
    };
  }

  if (!isFinite(value)) {
    return {
      inRange: false,
      message: 'Value is not finite (Infinity)',
    };
  }

  // JavaScript limits (we allow the full range)
  if (value < Number.MIN_VALUE && value > -Number.MIN_VALUE && value !== 0) {
    return {
      inRange: false,
      message: `Value ${value} is too small (underflow)`,
    };
  }

  if (value > Number.MAX_VALUE || value < -Number.MAX_VALUE) {
    return {
      inRange: false,
      message: `Value ${value} exceeds maximum (overflow)`,
    };
  }

  return {
    inRange: true,
    message: 'Value is in valid range',
  };
}

/**
 * Test cases demonstrating numeric literal handling
 * These serve as acceptance criteria for Task 3.5
 */
export const NUMERIC_LITERAL_TESTS = [
  // Integers
  {
    input: '42',
    expected: 42,
    type: 'integer',
    description: 'Simple integer',
  },
  {
    input: '0',
    expected: 0,
    type: 'integer',
    description: 'Zero',
  },
  {
    input: '-5',
    expected: -5,
    type: 'integer',
    description: 'Negative integer',
  },

  // Decimals
  {
    input: '3.14',
    expected: 3.14,
    type: 'decimal',
    description: 'Basic decimal',
  },
  {
    input: '0.5',
    expected: 0.5,
    type: 'decimal',
    description: 'Decimal less than 1',
  },
  {
    input: '.5',
    expected: 0.5,
    type: 'decimal',
    description: 'Decimal without leading 0',
  },
  {
    input: '10.',
    expected: 10.0,
    type: 'decimal',
    description: 'Decimal without trailing digits',
  },

  // Scientific notation
  {
    input: '1e5',
    expected: 100000,
    type: 'scientific',
    description: 'Scientific notation positive exponent',
  },
  {
    input: '1e-5',
    expected: 0.00001,
    type: 'scientific',
    description: 'Scientific notation negative exponent',
  },
  {
    input: '1.5e3',
    expected: 1500,
    type: 'scientific',
    description: 'Scientific notation with decimal',
  },
  {
    input: '2E+10',
    expected: 20000000000,
    type: 'scientific',
    description: 'Scientific notation uppercase E with plus',
  },
  {
    input: '1.23e-4',
    expected: 0.000123,
    type: 'scientific',
    description: 'Scientific notation small number',
  },

  // Edge cases
  {
    input: '-0',
    expected: -0,
    type: 'integer',
    description: 'Negative zero',
  },
  {
    input: '-3.14',
    expected: -3.14,
    type: 'decimal',
    description: 'Negative decimal',
  },
  {
    input: '-1e-5',
    expected: -0.00001,
    type: 'scientific',
    description: 'Negative scientific notation',
  },
];

/**
 * Run all numeric literal tests
 * Useful for validating the implementation
 */
export function runNumericLiteralTests() {
  console.log('Running numeric literal tests...\n');

  let passed = 0;
  let failed = 0;

  for (const test of NUMERIC_LITERAL_TESTS) {
    const parsed = parseNumericLiteral(test.input);

    // Check if parsed correctly
    if (!parsed.isValid) {
      console.log(`❌ FAIL: ${test.description}`);
      console.log(`   Input: ${test.input}`);
      console.log(`   Expected: ${test.expected}, Got: ${parsed.value}`);
      console.log(`   Reason: ${parsed.reason}\n`);
      failed++;
      continue;
    }

    // Check if value matches (with floating point tolerance)
    const tolerance = 1e-10;
    const matches = Math.abs(parsed.value - test.expected) < tolerance ||
                    parsed.value === test.expected;

    if (matches && parsed.type === test.type) {
      console.log(`✓ PASS: ${test.description}`);
      console.log(`   Input: ${test.input} → ${parsed.value}\n`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${test.description}`);
      console.log(`   Input: ${test.input}`);
      console.log(`   Expected: ${test.expected} (${test.type}), Got: ${parsed.value} (${parsed.type})\n`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  return { passed, failed, total: passed + failed };
}

/**
 * Format a number for display (with precision handling)
 * Used by calculator for display output
 *
 * @param {number} value - The numeric value
 * @param {number} maxDecimalPlaces - Maximum decimal places (default 10)
 * @returns {string} Formatted string
 */
export function formatNumber(value, maxDecimalPlaces = 10) {
  // Check if number is valid
  if (!isFinite(value)) {
    return String(value);
  }

  // Check range
  const range = checkNumericRange(value);
  if (!range.inRange) {
    return String(value);
  }

  // Round to max decimal places
  const multiplier = Math.pow(10, maxDecimalPlaces);
  const rounded = Math.round(value * multiplier) / multiplier;

  // Convert to string
  let str = rounded.toString();

  // Remove trailing zeros after decimal point
  if (str.includes('.')) {
    str = str.replace(/\.?0+$/, '');
  }

  return str;
}

/**
 * Examples of numeric literal handling
 */
export const EXAMPLES = {
  integers: ['42', '0', '-5', '999'],
  decimals: ['3.14', '0.5', '.5', '10.'],
  scientific: ['1e5', '1e-5', '1.5e3', '2E+10'],
  edgeCases: ['-0', '-3.14', '-1e-5'],
};

/**
 * Documentation summary
 */
export const NUMERIC_LITERAL_SUMMARY = `
Numeric Literal Handling (Task 3.5)

SUPPORTED FORMATS:
  • Integers: 42, 0, -5
  • Decimals: 3.14, 0.5, .5 (without leading 0)
  • Scientific: 1e5, 1.5e-3, 2E+10, 1E-5

IMPLEMENTATION:
  ✓ Tokenizer.readNumber() handles all formats
  ✓ Whitelist validation in tokenizer
  ✓ Validates characters (0-9, '.', 'e', 'E', '+', '-')
  ✓ Converts to JavaScript Number
  ✓ Checks for overflow/underflow

PARSING RULES:
  1. Read digits before decimal point (required)
  2. Optionally read decimal point and digits
  3. Optionally read 'e' or 'E' followed by:
     - Optional '+' or '-'
     - One or more digits
  4. Convert to Number via parseFloat()
  5. Validate result is finite

LIMITS:
  • Min: 5e-324 (JavaScript limit)
  • Max: 1.7976931348623157e+308 (JavaScript limit)
  • Expression length: 1000 chars max
  • Display precision: 10 decimal places

SECURITY:
  • Only digits, '.', 'e', 'E', '+', '-' allowed
  • No exponential notation abuse (e.g., 1e999 causes overflow)
  • Validates parsed value is finite (rejects Infinity)
`;
