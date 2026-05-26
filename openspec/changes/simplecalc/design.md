## Context

SimpleCalc is a new full-stack web application providing scientific calculation capabilities with a modern, responsive UI. The project will be built as a monorepo with separate frontend (React/Vite/TailwindCSS) and backend (Express.js) services, deployable to GitHub Pages (frontend only) and Docker containers (full stack).

**Current State:** New project, greenfield development

**Stakeholders:** End users seeking accessible scientific calculator functionality, developers integrating calculator APIs

## Goals / Non-Goals

**Goals:**
- Provide a modern, accessible scientific calculator with a beautiful user interface
- Enable safe, validated expression parsing without code injection vulnerabilities
- Support persistent calculation history across browser sessions
- Deliver full keyboard accessibility and multi-device responsiveness
- Enable flexible deployment (GitHub Pages for frontend, Docker for full stack)
- Implement smooth animations and visual feedback for user interactions
- Provide clear API contracts between frontend and backend services

**Non-Goals:**
- Complex graphing or visualization capabilities (beyond basic UI)
- Real-time collaborative features
- Advanced statistical analysis beyond calculator scope
- Mobile-specific native apps (web-only solution)
- Advanced authentication/authorization (single-user calculator)

## Decisions

### 1. Architecture: Monorepo with Separated Frontend/Backend Services
**Decision:** Use a monorepo structure with separate `frontend` and `backend` directories.

**Rationale:** 
- Enables independent deployment strategies (GitHub Pages for frontend, Docker for full stack)
- Allows frontend to work standalone with minimal backend dependencies
- Simplifies development workflow and dependency management
- Facilitates separate testing and CI/CD pipelines

**Alternatives Considered:**
- Full-stack single deployment: Would reduce flexibility for GitHub Pages deployment
- Separate repositories: Would complicate monorepo state management and deployment coordination

### 2. Frontend Framework: React + Vite + TailwindCSS
**Decision:** Use React as the component framework, Vite as the build tool, and TailwindCSS for styling.

**Rationale:**
- React provides component-based architecture suitable for calculator UI complexity
- Vite offers fast development experience and optimized production builds
- TailwindCSS enables rapid responsive design without managing separate CSS files
- All three tools are modern, well-maintained, and have strong ecosystem support

**Alternatives Considered:**
- Vue/Svelte: Good alternatives but React ecosystem is broader for this use case
- Webpack/Rollup: More complex setup than Vite for this project scale

### 3. Expression Parser: Custom Tokenizer + Recursive Descent AST
**Decision:** Implement a custom expression parser using tokenization → recursive descent parsing → AST evaluation on the Express.js backend.

**Architecture:**
```
Expression Input → Tokenizer → Parser (Recursive Descent) → AST → Evaluator → Result
```

**Components:**
1. **Tokenizer**: Lexical analysis with strict whitelist of allowed operators/functions
2. **Parser**: Recursive descent parser generating an Abstract Syntax Tree (AST)
3. **AST Nodes**: BinaryOp, UnaryOp, FunctionCall, Literal, Constant
4. **Evaluator**: Walk AST depth-first, execute operations with proper precedence

**Allowed Functions & Constants:**
- **Trigonometric:** sin, cos, tan, asin, acos, atan
- **Logarithmic:** log (base 10), ln (natural log)
- **Power/Root:** ^ (exponentiation), sqrt (√)
- **Special:** factorial (!), percentage (%)
- **Constants:** π (pi), e
- **Operators:** + - * / ( )

**Excluded (Out of Scope):**
- Hyperbolic functions (sinh, cosh, tanh)
- Matrix operations
- Calculus operations
- Symbolic algebra
- Custom variables or user-defined functions

**Rationale:**
- Full control over allowed operations (whitelist = maximum security)
- No eval() or Function() constructor (prevents code injection)
- AST structure enables precise error messages and debugging
- Supports all scientific functions needed for calculator scope
- Sub-10ms evaluation time for typical expressions
- Single point of validation and error handling

**Alternatives Considered:**
- Third-party library (math.js): Black-box evaluation, harder to control error messages
- Shunting-yard algorithm: Works well but AST is cleaner for debugging
- Client-side evaluation: Security risks with eval()

**Security Guarantees:**
- Tokenizer rejects any unwhitelisted operator or function
- Parser enforces valid expression syntax
- Evaluator never executes arbitrary code
- No access to global scope or Node.js built-ins

### 4. State Management: Frontend-Managed with React Hooks + LocalStorage
**Decision:** All calculator state (expression, history, memory functions) managed on frontend. Backend is stateless and only validates/evaluates.

**Frontend State Structure:**
```javascript
{
  expression: string,           // Current input: "5 + 3"
  displayValue: string,         // What user sees: "8"
  history: Array<HistoryEntry>, // Persistent calculation history
  memory: { M: number },        // Memory register for M+, M-, MR, MC
  theme: 'light' | 'dark',      // User preference
  angleMode: 'degrees' | 'radians',
  decimalPlaces: 10,            // Display precision
  error: null | string          // Current error message
}
```

**History Persistence:**
- Primary storage: Browser LocalStorage (JSON serialized)
- Limit: 100 most recent entries
- Eviction: FIFO when limit exceeded
- Automatic: Saved immediately after each calculation
- Graceful degradation: Works offline, no network required

**Backend Role:**
- Stateless: No session or user state
- Validation only: Validate expression syntax
- Evaluation only: Parse and evaluate, return result
- No history storage: Backend does not persist history
- Optional analytics: Can log calculations (not persisted)

**Memory Functions (M+, M-, MR, MC):**
- Managed entirely on frontend
- Persisted to localStorage with history
- Reset on browser clear data
- No server-side memory state

**Rationale:**
- Instant UI feedback (no network round-trip for state)
- Works offline completely
- No backend complexity (stateless = easy to scale)
- Simple localStorage sufficient for single-user calculator
- Future option: Cross-device sync with backend (requires auth)

**Alternatives Considered:**
- Backend storage: Requires user authentication, adds complexity
- IndexedDB: Unnecessarily complex for calculator scope
- Redux/Context: Overkill for single-page calculator state

### 5. Styling and Animations: TailwindCSS + Framer Motion
**Decision:** Use TailwindCSS for styling and Framer Motion for animations/transitions.

**Rationale:**
- TailwindCSS provides utility-first approach for rapid responsive design
- Framer Motion offers declarative, performant animations
- Both libraries integrate smoothly with React ecosystem
- Enables consistent design language across components

**Alternatives Considered:**
- CSS-in-JS: More complex setup than utility classes
- Native CSS animations: Less ergonomic for complex interactive animations

### 6. Deployment Strategy: GitHub Pages (Frontend) + Docker (Full Stack)
**Decision:** Package frontend for GitHub Pages deployment; provide Docker Compose for full-stack deployment.

**Rationale:**
- GitHub Pages provides free, automated static site hosting for frontend
- Docker enables reproducible deployments in any environment (development, staging, production)
- GitHub Actions CI/CD automates build and deployment workflows
- Supports users with different hosting preferences (serverless vs. containerized)

**Alternatives Considered:**
- Single deployment method: Limits flexibility for different deployment contexts
- Traditional server hosting: Higher operational overhead compared to containerized approach

### 7. API Design: Minimal RESTful Endpoints (Stateless)
**Decision:** Implement minimal RESTful API. Backend evaluates only; frontend manages history and state.

**Core Endpoints:**
```
POST /api/calculate
  Input:  { expression: "5 + 3 * sin(π/2)" }
  Output: { result: 8, expression: "5 + 3 * sin(π/2)", error?: string }
  Purpose: Validate and evaluate expression
  Security: Strict whitelist validation, no eval()
```

**Optional Endpoints (Not Required Phase 1):**
```
GET  /api/config          - Get app configuration (functions list, constants)
POST /api/analytics       - Log calculation (optional)
```

**Note on History:**
- History is NOT sent to backend initially
- Managed entirely on frontend in localStorage
- Backend does not persist history
- Future: Backend history endpoints if cross-device sync needed

**Rationale:**
- Stateless backend = simpler, faster, scalable
- Frontend manages all persistent state (UX is better)
- Fewer endpoints = less complexity
- Clear separation: validation on backend, state on frontend
- Extensible: Can add backend persistence later if needed

**Alternatives Considered:**
- Full backend state management: Requires auth, complicates architecture
- GraphQL: Unnecessary for single calculate endpoint

## Error Handling Strategy

**Non-Intrusive Validation:**
- While typing: Background syntax check (no error display)
- Display current expression as-is
- Show error only on submit (press =)
- After error: Allow immediate correction and re-submission

**Error Message Examples:**
```
Unmatched parentheses:     "Error: Unmatched closing parenthesis at position 8"
Unknown function:          "Error: Unknown function 'sind' (did you mean 'sin'?)"
Invalid operator sequence: "Error: Invalid operator sequence: '5 ++ 3'"
Division by zero:          "Error: Division by zero"
Invalid arguments:         "Error: sqrt(-1) is undefined for real numbers"
```

**Key Principles:**
- Clear, human-readable messages
- Position information when relevant
- Suggestion for common typos
- Never show parser internals
- Always recoverable: User can fix and re-submit

## Precision & Display

**Default Settings:**
- Display precision: 10 decimal places (configurable)
- Automatic trailing zero removal: 3.5 not 3.50
- Large numbers in standard notation (not scientific)
- Results exact where possible (e.g., sin(π/2) = 1.0)

**Performance Target:**
- Expression evaluation: Sub-10ms for typical inputs
- Complex expressions: <50ms for deeply nested functions
- Tokenization + parsing: <2ms

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **Expression Parser Security** → Input validation bypass or injection attack | Strict whitelist at tokenizer level (only π, e, sin, cos, etc.); AST prevents eval(); extensive unit tests for injection attempts |
| **LocalStorage Quota Exceeded** → History grows beyond browser limits | Automatic pruning to 100 entries; warn user at 80% quota; manual clear option in settings |
| **Cross-Browser Compatibility** → Different browser support for features | Test against Chrome, Firefox, Safari, Edge; localStorage widely supported; fallbacks for animations |
| **Keyboard Navigation** → Missing or inconsistent shortcuts | Comprehensive keyboard event handling; test with screen readers and keyboards; document all shortcuts |
| **Docker Image Size** → Large image footprint affecting deployment | Multi-stage builds; Alpine Linux base; prune non-essential dependencies |
| **AST Evaluation Performance** → Building tree adds overhead | Pre-compile where possible; profile typical expressions; < 10ms target for standard inputs |
| **Memory Function State Loss** → Browser data cleared loses M+ values | Design pattern: M+ for session only, cleared on page reload (acceptable for calculator) |
| **Floating Point Precision** → Rounding errors in math operations | Limit display to 10 decimals; document precision limitations; use proper rounding functions |

## Migration Plan

Since this is a new project, there is no migration from existing systems. However, deployment phases are:

1. **Development Phase**: Local development with separate frontend/backend servers
2. **Build Phase**: Frontend Vite build for GitHub Pages; backend Docker image build
3. **Deployment Phase**: 
   - Frontend: Push to GitHub Pages via GitHub Actions
   - Backend: Push Docker image to registry (Docker Hub or GitHub Container Registry)
4. **Rollback Strategy**: 
   - Frontend: Revert commit and rebuild; GitHub Pages automatically uses latest
   - Backend: Roll back Docker image tag in deployment configuration

## Implementation Sequence (Dependency Order)

**Phase 1: Parser Foundation**
1. Tokenizer (whitelist validation)
2. Recursive descent parser
3. AST node types
4. Basic evaluator
5. Backend /api/calculate endpoint

**Phase 2: Frontend UI**
1. Calculator display component
2. Button grid
3. Basic state management (useCalculator hook)
4. Integration with /api/calculate
5. Error display

**Phase 3: History & Memory**
1. History state management
2. localStorage persistence
3. History panel UI
4. Memory functions (M+, M-, MR, MC)
5. History search/export

**Phase 4: Polish**
1. Keyboard navigation
2. Theme system
3. Responsive design
4. Animations
5. Accessibility improvements

**Phase 5: Deployment**
1. GitHub Actions CI/CD
2. GitHub Pages frontend deployment
3. Docker backend containerization
4. Documentation

## Open Questions

1. **Backend Hosting (Phase 2)**: Should we provide example deployments for common platforms (Vercel, Heroku, AWS)?
2. **Testing Coverage**: Target 80%+ coverage on parser, 70%+ on UI?
3. **API Documentation**: Swagger/OpenAPI or simple markdown docs?
4. **Performance Monitoring**: Add Lighthouse CI or performance budget tracking?
