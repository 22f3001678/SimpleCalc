# SimpleCalc Development Quick Reference

**Project Status:** Phase 1 Complete ✅  
**Last Updated:** May 27, 2025

---

## 📚 Documentation Index

### For Project Managers/Stakeholders
- **[IMPLEMENTATION_REPORT.md](./IMPLEMENTATION_REPORT.md)** - Complete Phase 1 summary, metrics, status
- **[README.md](./README.md)** - Project overview, technology stack, quick start
- **[PHASE1_SUMMARY.md](./PHASE1_SUMMARY.md)** - Detailed Phase 1 breakdown by task

### For Developers
- **[backend/README.md](./backend/README.md)** - Backend architecture, file structure, how-to guide
- **[openspec/changes/simplecalc/design.md](./openspec/changes/simplecalc/design.md)** - Architecture decisions, risk analysis
- **[openspec/changes/simplecalc/tasks.md](./openspec/changes/simplecalc/tasks.md)** - Complete task list (212 tasks total)

### For Security Review
- **[backend/parser/whitelist.js](./backend/parser/whitelist.js)** - Explicit whitelist of allowed operations
- **[backend/middleware/errorHandler.js](./backend/middleware/errorHandler.js)** - Error handling strategy
- See "Security Analysis" in IMPLEMENTATION_REPORT.md

---

## 🚀 Quick Start

```bash
# Clone and navigate
cd SimpleCalc/backend

# Install and run
npm install
npm run dev

# Test tokenizer
node parser/test-tokenizer.js

# Server runs on http://localhost:3001
# Health check: curl http://localhost:3001/health
```

---

## 📋 Phase 1 Implementation (✅ Complete)

### Tasks Completed: 15/15

#### Project Setup (3/3)
- ✅ 1.1 Monorepo structure
- ✅ 1.2 .gitignore file
- ✅ 1.4 README.md

#### Backend Foundation (5/5)
- ✅ 2.1 package.json
- ✅ 2.2 Express server
- ✅ 2.3 Environment variables
- ✅ 2.5 Error handling middleware
- ✅ 2.6 Request logging middleware

#### Tokenizer (7/7)
- ✅ 3.1 Token types & TokenStream
- ✅ 3.2 Whitelist definitions
- ✅ 3.3 Tokenizer implementation
- ✅ 3.4 Token validator
- ✅ 3.5 Numeric literal handling

---

## 📂 Key Files

### Core Backend
| File | Purpose | Status |
|------|---------|--------|
| `backend/server.js` | Express setup | ✅ 5KB |
| `backend/middleware/errorHandler.js` | Error handling | ✅ 3.3KB |
| `backend/middleware/logger.js` | Request logging | ✅ 5.5KB |

### Parser (Phase 1 Complete)
| File | Purpose | Status |
|------|---------|--------|
| `backend/parser/tokens.js` | Token types | ✅ 5.4KB |
| `backend/parser/whitelist.js` | Security whitelist | ✅ 6.6KB |
| `backend/parser/tokenizer.js` | Lexical analysis | ✅ 8.9KB |
| `backend/parser/validator.js` | Token validation | ✅ 10.1KB |
| `backend/parser/numeric-literals.js` | Number parsing | ✅ 8.4KB |

### Parser (Phase 2-5 Pending)
| File | Purpose | Status |
|------|---------|--------|
| `backend/parser/parser.js` | Recursive descent parser | ⏳ |
| `backend/parser/ast-nodes.js` | AST node definitions | ⏳ |
| `backend/parser/evaluator.js` | AST evaluation | ⏳ |
| `backend/math/operations.js` | Math functions | ⏳ |
| `backend/math/constants.js` | Constants | ⏳ |
| `backend/routes/calculate.js` | POST /api/calculate | ⏳ |

---

## 🧪 Testing

### Quick Tests
```bash
# Test tokenizer
node backend/parser/test-tokenizer.js

# Manual test
cd backend
node -e "import('./parser/tokenizer.js').then(m => m.tokenize('5 + 3'))"
```

### Full Test Suite (To Be Added)
```bash
npm test
npm run test:parser
npm run test:watch
```

---

## 🔒 Security Checklist

✅ No `eval()` or `Function()` constructor  
✅ Explicit whitelist for all operations  
✅ Character-level input validation  
✅ Token sequence validation  
✅ Balanced parentheses checking  
✅ Input length limit (1000 chars)  
✅ Nesting depth limit (50 levels)  
✅ Error messages with position info  
✅ No database query injection (N/A - no DB in Phase 1)  
✅ CORS configured properly  

---

## 📊 Architecture Overview

```
User Input: "5 + 3 * 2"
    ↓
[Tokenizer] → [NUMBER(5), PLUS, NUMBER(3), MULTIPLY, NUMBER(2)]
    ↓
[Validator] → ✓ Valid sequence
    ↓
[Parser] → (Phase 3) AST tree
    ↓
[Evaluator] → (Phase 4) Result: 11
    ↓
[API Response] → { result: 11, expression: "5 + 3 * 2" }
```

---

## 🛠️ Development Workflow

### Adding a New Feature

1. **Update whitelist** if adding new operators/functions
   - `backend/parser/whitelist.js`

2. **Update token types** if adding new token category
   - `backend/parser/tokens.js`

3. **Update tokenizer** if needed for new syntax
   - `backend/parser/tokenizer.js`

4. **Update validator** for new sequence rules
   - `backend/parser/validator.js`

5. **Add tests**
   - `backend/parser/tokenizer.test.js`

6. **Document** in code comments and README

### Code Style

- 2-space indentation
- JSDoc comments for all functions
- Descriptive variable names
- Error messages with context
- No console.log (use logger.js)

---

## 🎯 Next Phase Goals

### Phase 2 (Backend Setup Completion)
- [ ] API route placeholder
- [ ] Request validation middleware

### Phase 3 (Parser Implementation - Est. 4-5 hours)
- [ ] AST node definitions
- [ ] Recursive descent parser
- [ ] Operator precedence
- [ ] Parentheses handling
- [ ] >90% test coverage

### Phase 4 (Evaluator - Est. 3-4 hours)
- [ ] Math operations
- [ ] Precision handling
- [ ] Error handling

### Phase 5 (API Endpoint - Est. 2-3 hours)
- [ ] Complete POST /api/calculate

---

## 📞 Common Tasks

### Start Development Server
```bash
cd backend
npm run dev
```

### Run Linting
```bash
npm run lint
npm run lint:fix
```

### Debug a Test Case
```bash
node backend/parser/test-tokenizer.js
```

### Check Whitelist
```bash
grep -A 20 "export const FUNCTIONS" backend/parser/whitelist.js
```

### View Error Handler
```bash
cat backend/middleware/errorHandler.js
```

---

## 🔗 Related Resources

- **OpenSpec Config:** `openspec/config.yaml`
- **OpenSpec Tasks:** `openspec/changes/simplecalc/tasks.md`
- **Full Design:** `openspec/changes/simplecalc/design.md`
- **Specifications:** `openspec/changes/simplecalc/specs/`
- **Proposal:** `openspec/changes/simplecalc/proposal.md`

---

## 📈 Progress Tracking

| Phase | Status | Tasks | Target |
|-------|--------|-------|--------|
| 1 | ✅ Done | 15/15 | Project foundation |
| 2 | ⏳ Ready | 1/1 | API setup |
| 3 | 🚀 Next | 7/7 | Parser implementation |
| 4 | 📋 Planned | 11/11 | Evaluator |
| 5 | 📋 Planned | 7/7 | API endpoint |
| 6+ | 📋 Planned | 170/170 | Frontend & deployment |

**Total Progress:** 15/212 tasks complete (7%)

---

## ❓ FAQ

**Q: Where's the parser?**  
A: Coming in Phase 3. Phase 1 handles tokenization only.

**Q: Can I evaluate expressions yet?**  
A: No. The API endpoint isn't wired yet (Phase 5).

**Q: How do I add a new function?**  
A: Update FUNCTIONS in whitelist.js, then implement in Phase 4.

**Q: Is it secure?**  
A: Yes! No eval(), explicit whitelist, multi-stage validation.

**Q: What if I find a bug?**  
A: Create an issue with: expression, expected result, actual result.

---

**For issues or questions, see [backend/README.md](backend/README.md) or [IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md)**

---

Last Updated: May 27, 2025  
Phase: 1 ✅ Complete  
Next: Phase 2 (Parser framework)
