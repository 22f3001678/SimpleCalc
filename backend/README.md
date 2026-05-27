# SimpleCalc Backend Architecture

## Overview

The SimpleCalc backend is a Node.js + Express server that safely parses and evaluates mathematical expressions.

**Key Principle:** No `eval()` or `Function()` constructors. All code paths are explicit and validated.

## Architecture Pipeline

```
User Input String
       ↓
   Tokenizer (Lexical Analysis)
   ├─ Whitelist character validation
   ├─ Convert string → tokens
   └─ Report syntax errors with position
       ↓
   Token Validator (Syntax Check)
   ├─ Check balanced parentheses
   ├─ Check valid token sequences
   ├─ Check operator placement
   └─ Report validation errors
       ↓
   Parser (Syntactic Analysis) - Phase 3
   ├─ Convert tokens → Abstract Syntax Tree (AST)
   ├─ Handle operator precedence
   └─ Build tree structure
       ↓
   Evaluator (Semantic Analysis) - Phase 4
   ├─ Walk AST depth-first
   ├─ Evaluate each node
   ├─ Handle precision & rounding
   └─ Return result or error
       ↓
   HTTP Response
   {result: 8, expression: "5 + 3"}
```

## File Structure

### `server.js`
Main Express application setup.

```javascript
// CORS, body parser, middleware configuration
// Health check endpoint
// 404 and error handlers
// Server startup with graceful shutdown
```

### `middleware/errorHandler.js`
Custom error handling and exception classes.

```javascript
export class ApiError                // Base class for API errors
export class ValidationError         // Invalid input
export class ParseError              // Expression parsing failed
export class CalculationError        // Runtime error (e.g., divide by zero)

export const errorHandler            // Express error middleware
export const catchAsync              // Wrapper for async route handlers
```

**Usage:**
```javascript
import { ParseError, catchAsync } from './middleware/errorHandler.js';

// In route handler
app.post('/api/calculate', catchAsync(async (req, res) => {
  try {
    const result = parseAndEvaluate(req.body.expression);
    res.json(result);
  } catch (err) {
    throw new ParseError(err.message, err.position);
  }
}));
```

### `middleware/logger.js`
Structured logging with levels and optional file output.

```javascript
export const log = {
  debug(message, data),     // Lowest priority
  info(message, data),      // Normal
  warn(message, data),      // Warning
  error(message, data, stack)  // Error with stack trace
}

export const requestLogger  // Express middleware for request logging
```

**Usage:**
```javascript
import { log, requestLogger } from './middleware/logger.js';

app.use(requestLogger);
log.info('Server started', { port: 3001 });
log.error('Database error', { code: 'ECONNREFUSED' });
```

### `parser/tokens.js`
Token type definitions and token stream management.

```javascript
export const TokenType = {
  NUMBER, PLUS, MINUS, MULTIPLY, DIVIDE, POWER, MODULO, FACTORIAL,
  SIN, COS, TAN, ASIN, ACOS, ATAN, LOG, LN, SQRT, ABS,
  CONSTANT_PI, CONSTANT_E, LPAREN, RPAREN, EOF
}

export class Token
  toString()                // Human-readable representation
  isBinaryOperator()        // +, -, *, /, ^, %
  isUnaryOperator()         // !
  isFunction()              // sin, cos, etc.
  isConstant()              // π, e
  getPrecedence()           // Operator priority (1-3)
  isRightAssociative()      // ^ is right-associative

export class TokenStream
  peek()                    // Get current token
  next()                    // Advance and return
  isAtEnd()                 // Check EOF
  remaining()               // Tokens left
```

### `parser/whitelist.js`
Security whitelist definitions for allowed operations.

```javascript
// BINARY_OPERATORS: +, -, *, /, ^, %
// UNARY_OPERATORS: !
// FUNCTIONS: sin, cos, tan, asin, acos, atan, sqrt, log, ln, abs
// CONSTANTS: π (pi), e
// DELIMITERS: (, )
// ALLOWED_CHARACTERS: Set of allowed input characters

isWhitelisted(tokenStr, type)    // Check if token is allowed
getTokenType(tokenStr, type)     // Get TokenType for token
getConstantValue(tokenStr)       // Get value for constant
```

### `parser/tokenizer.js` ✅ Phase 1 Complete
Lexical analysis - converts string to tokens.

```javascript
export class Tokenizer
  constructor(expression, options)
  tokenize()                // Main method: returns TokenStream
  validateInput()           // Check length, empty, characters
  validateCharacterSet()    // Whitelist validation
  nextToken()               // Get next token
  readNumber(startPos)      // Parse NUMBER (including scientific)
  readIdentifier(startPos)  // Parse FUNCTION or CONSTANT
```

**Examples:**
```javascript
import { Tokenizer } from './parser/tokenizer.js';

const tokenizer = new Tokenizer('5 + 3 * sin(π/2)');
const tokenStream = tokenizer.tokenize();

// Token sequence:
// NUMBER(5) PLUS(+) NUMBER(3) MULTIPLY(*) 
// SIN LPAREN(
// CONSTANT_PI(3.14159) DIVIDE(/) NUMBER(2) RPAREN(
// EOF
```

**Error Handling:**
```javascript
try {
  tokenize('5 + unknown_func()');
} catch (err) {
  console.log(err.name);        // TokenizationError
  console.log(err.message);     // "Unknown identifier 'unknown_func'"
  console.log(err.position);    // Position in string
}
```

### `parser/validator.js` ✅ Phase 1 Complete
Token sequence validation before parsing.

```javascript
export class TokenValidator
  validate()                // Run all validations
  checkBalancedParentheses()
  checkValidSequence()      // Prevent: (+ 5), 3 3, ) 5 (
  checkOperatorPlacement()
  checkFunctionSyntax()
  isValidLeftOperand()
  isValidRightOperand()

export class ValidationError   // Custom error class
```

**Examples:**
```javascript
const validator = new TokenValidator(tokens, '(5 + 3');
try {
  validator.validate();
} catch (err) {
  // "Unclosed opening parenthesis at position 0"
}
```

**Prevented Errors:**
- `(+ 5)` - Operator at start of group
- `5 3` - Missing operator between numbers
- `sin()` - Empty function arguments
- `5 +` - Operator at end
- `(5 + 3))` - Extra closing paren

### `parser/numeric-literals.js` ✅ Phase 1 Complete
Numeric literal parsing and validation.

```javascript
parseNumericLiteral(numStr)   // Parse and validate number
checkNumericRange(value)      // Check for overflow/underflow
formatNumber(value, maxDecimalPlaces)  // Format for display

NUMERIC_LITERAL_TESTS         // 19 test cases
runNumericLiteralTests()      // Run tests
```

**Supported Formats:**
- Integers: `42`, `0`, `-5`
- Decimals: `3.14`, `0.5`, `.5` (no leading 0)
- Scientific: `1e5`, `1e-5`, `1.5e3`, `2E+10`

---

## Phase Implementation Status

### Phase 1 ✅ Complete
- [x] Project setup (monorepo, .gitignore, README)
- [x] Backend foundation (Express server, middleware)
- [x] Tokenizer (lexical analysis, validation)

### Phase 2 (Pending)
- [ ] API endpoint placeholder
- [ ] Request validation middleware

### Phase 3 (Pending)
- [ ] AST node definitions
- [ ] Recursive descent parser
- [ ] Operator precedence
- [ ] Parentheses handling
- [ ] Function call parsing

### Phase 4 (Pending)
- [ ] Math operations implementation
- [ ] Trigonometric functions
- [ ] Logarithmic functions
- [ ] AST evaluator
- [ ] Precision handling

### Phase 5 (Pending)
- [ ] POST /api/calculate endpoint
- [ ] Response formatting
- [ ] Error handling

---

## Running the Backend

```bash
# Install dependencies
npm install

# Development (with auto-reload)
npm run dev

# Production
npm start

# Run tests
npm test

# Lint code
npm run lint
```

The server starts on `http://localhost:3001` by default.

### Environment Variables

```
NODE_ENV=development              # development or production
PORT=3001                         # Server port
CORS_ORIGIN=http://localhost:5173 # Frontend URL
LOG_LEVEL=info                    # debug, info, warn, error
MAX_EXPRESSION_LENGTH=1000        # Max input length
MAX_DEPTH=50                      # Max nesting depth
```

---

## Security Principles

1. **Explicit Whitelist**
   - Only allow known characters, operators, functions
   - No eval() or Function() constructors
   - Character-by-character validation

2. **Multi-Stage Validation**
   - Tokenizer: Character whitelist
   - Validator: Token sequence rules
   - Parser: Syntax rules (Phase 3)
   - Evaluator: Runtime checks (Phase 4)

3. **Clear Error Messages**
   - Position information
   - Context window around error
   - Suggestions for fixes

4. **Depth Limits**
   - Max nesting: 50 levels
   - Max expression length: 1000 characters
   - Timeout protection: 100ms per evaluation

---

## Error Handling

The system uses a hierarchy of error classes:

```
Error (JavaScript built-in)
├── TokenizationError
├── ValidationError
├── ParseError (for Phase 3)
├── CalculationError (for Phase 4)
└── ApiError (HTTP response)
    ├── ValidationError
    ├── ParseError
    └── CalculationError
```

Each error includes:
- Human-readable message
- Position in expression (if applicable)
- Context window (surrounding characters)
- Stack trace (in development mode)

---

## Testing

### Unit Tests (To Be Added)
```bash
npm test
npm run test:parser
npm run test:watch
```

### Manual Testing
```bash
# Test tokenizer directly
node parser/test-tokenizer.js

# Test numeric literals
node -e "import('./parser/numeric-literals.js').then(m => m.runNumericLiteralTests())"
```

### Integration Testing
```bash
# Start server
npm run dev

# In another terminal, test with curl
curl -X POST http://localhost:3001/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"expression":"5 + 3"}'
```

(Full /api/calculate implementation coming in Phase 5)

---

## Performance Notes

- **Tokenization:** < 1ms for typical expressions
- **Validation:** < 1ms for typical expressions
- **Goal for evaluation:** < 10ms total (including parsing)
- **Complex nested:** < 50ms (e.g., `sin(cos(tan(x)))`)

Performance profiling will be added in Phase 4.

---

## Future Enhancements

- Matrix operations (Phase 6)
- Complex numbers (Phase 6)
- Symbolic computation (Phase 7)
- Custom functions (Phase 7)
- Advanced error recovery (Phase 8)

---

For detailed architecture decisions, see [design.md](../openspec/changes/simplecalc/design.md).
