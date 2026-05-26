## 1. Project Setup

- [ ] 1.1 Initialize monorepo structure with frontend and backend directories
- [ ] 1.2 Create root .gitignore with node_modules, dist, build, .env patterns
- [ ] 1.3 Set up git configuration and initial commit
- [ ] 1.4 Create root README.md with project overview and technology stack

## 2. Backend Foundation

- [ ] 2.1 Initialize backend package.json with Express, cors, body-parser, dotenv
- [ ] 2.2 Create Express server with CORS and body parser middleware
- [ ] 2.3 Set up environment variable configuration (.env, dotenv support)
- [ ] 2.4 Create server startup and graceful shutdown handlers
- [ ] 2.5 Set up error handling middleware
- [ ] 2.6 Add request logging middleware (morgan or custom)

## 3. Expression Parser - Tokenizer

- [ ] 3.1 Define token types (NUMBER, OPERATOR, FUNCTION, CONSTANT, LPAREN, RPAREN)
- [ ] 3.2 Create operator/function whitelist (allowed: +, -, *, /, sin, cos, tan, asin, acos, atan, sqrt, log, ln, ^, !, %, π, e)
- [ ] 3.3 Implement tokenizer (lexer) for expression string → token stream
- [ ] 3.4 Add tokenizer validation (reject unwhitelisted operators/functions)
- [ ] 3.5 Handle numeric literals (integers, decimals, scientific notation)
- [ ] 3.6 Handle implicit multiplication (2π, 3sin(x), etc.)
- [ ] 3.7 Create comprehensive tokenizer unit tests

## 4. Expression Parser - Recursive Descent Parser

- [ ] 4.1 Define AST node types (BinaryOp, UnaryOp, FunctionCall, Literal, Constant)
- [ ] 4.2 Implement recursive descent parser → AST
- [ ] 4.3 Handle operator precedence (*, / before +, -)
- [ ] 4.4 Handle parentheses and grouping
- [ ] 4.5 Handle function calls with arguments
- [ ] 4.6 Implement error recovery (report position and context)
- [ ] 4.7 Create comprehensive parser unit tests

## 5. Expression Parser - Evaluator

- [ ] 5.1 Implement basic arithmetic operations (+, -, *, /)
- [ ] 5.2 Implement trigonometric functions (sin, cos, tan, asin, acos, atan)
- [ ] 5.3 Implement logarithmic functions (log base 10, ln)
- [ ] 5.4 Implement power and root operations (^, sqrt)
- [ ] 5.5 Implement special functions (factorial !, percentage %)
- [ ] 5.6 Add mathematical constants (π, e with correct values)
- [ ] 5.7 Implement AST evaluation (depth-first traversal)
- [ ] 5.8 Handle precision (default 10 decimal places)
- [ ] 5.9 Handle division by zero gracefully
- [ ] 5.10 Create comprehensive evaluator unit tests
- [ ] 5.11 Profile performance (target: <10ms for typical expressions)

## 6. Backend API Endpoint

- [ ] 6.1 Create POST /api/calculate endpoint
- [ ] 6.2 Implement request validation (expression string)
- [ ] 6.3 Implement expression parsing and evaluation
- [ ] 6.4 Return result with { result: number, expression: string, error?: string }
- [ ] 6.5 Add error handling (return 400 for invalid expressions)
- [ ] 6.6 Test endpoint with curl or Postman (sample requests)
- [ ] 6.7 Verify CORS headers are correct

## 7. Frontend Setup (React + Vite)

- [ ] 7.1 Initialize React project with Vite
- [ ] 7.2 Configure Vite for development and production builds
- [ ] 7.3 Install and configure TailwindCSS
- [ ] 7.4 Install Framer Motion for animations
- [ ] 7.5 Create src directory structure (components, hooks, utils, styles)
- [ ] 7.6 Configure environment variables for API endpoint
- [ ] 7.7 Create global CSS with Tailwind imports
- [ ] 7.8 Create initial App.jsx component

## 8. Frontend State Management

- [ ] 8.1 Create useCalculator React hook for state management
- [ ] 8.2 Implement expression state (user input buffer)
- [ ] 8.3 Implement result state (last evaluated result)
- [ ] 8.4 Implement history state (persistent in localStorage)
- [ ] 8.5 Implement memory state (M register)
- [ ] 8.6 Implement theme state (light/dark preference)
- [ ] 8.7 Implement angle mode state (degrees/radians)
- [ ] 8.8 Implement error state (current error message)
- [ ] 8.9 Add localStorage persistence for history and memory
- [ ] 8.10 Create unit tests for state management

## 9. Calculator Display Component

- [ ] 9.1 Create Display component (shows expression and result)
- [ ] 9.2 Style display area with TailwindCSS (large, readable)
- [ ] 9.3 Show current expression in smaller text
- [ ] 9.4 Show result/error in larger text
- [ ] 9.5 Add error state styling (red background, warning color)
- [ ] 9.6 Make display responsive (scale on mobile vs desktop)
- [ ] 9.7 Create component tests

## 10. Calculator Button Grid

- [ ] 10.1 Create Button component (reusable button with states)
- [ ] 10.2 Create number buttons (0-9)
- [ ] 10.3 Create operation buttons (+, -, *, /)
- [ ] 10.4 Create function buttons (sin, cos, tan, asin, acos, atan, sqrt, log, ln, ^, !)
- [ ] 10.5 Create constant buttons (π, e)
- [ ] 10.6 Create special buttons (=, C, DEL, (, ))
- [ ] 10.7 Create memory buttons (M+, M-, MR, MC)
- [ ] 10.8 Arrange buttons in grid layout (responsive)
- [ ] 10.9 Add click event handlers (append to expression or trigger actions)
- [ ] 10.10 Style buttons with hover/active states

## 11. Frontend-Backend Integration

- [ ] 11.1 Create API client utility (fetch wrapper for /api/calculate)
- [ ] 11.2 Implement POST request to /api/calculate with expression
- [ ] 11.3 Handle successful response (display result)
- [ ] 11.4 Handle error response (display error message)
- [ ] 11.5 Add loading state while waiting for backend
- [ ] 11.6 Add timeout handling (if backend takes too long)
- [ ] 11.7 Test integration with running backend

## 12. Calculation History

- [ ] 12.1 Create History component (scrollable list)
- [ ] 12.2 Implement history state in useCalculator hook
- [ ] 12.3 Auto-save calculation to history after each evaluation
- [ ] 12.4 Persist history to localStorage
- [ ] 12.5 Display history entries (expression, result, timestamp)
- [ ] 12.6 Implement click to reuse: select history entry → load expression
- [ ] 12.7 Implement delete single entry
- [ ] 12.8 Implement clear all history with confirmation
- [ ] 12.9 Implement history search/filter
- [ ] 12.10 Add copy result to clipboard button
- [ ] 12.11 Create history limit (max 100 entries)
- [ ] 12.12 Add history panel slide-in/out animation
- [ ] 12.13 Create component tests

## 13. Memory Functions

- [ ] 13.1 Implement M+ (add current result to memory)
- [ ] 13.2 Implement M- (subtract current result from memory)
- [ ] 13.3 Implement MR (recall memory value, insert into expression)
- [ ] 13.4 Implement MC (clear memory)
- [ ] 13.5 Persist memory to localStorage
- [ ] 13.6 Display memory indicator when M != 0
- [ ] 13.7 Create memory UI component/buttons
- [ ] 13.8 Create unit tests for memory functions

## 14. Theme System

- [ ] 14.1 Create ThemeContext for React
- [ ] 14.2 Define color schemes (light and dark)
- [ ] 14.3 Create ThemeProvider wrapper component
- [ ] 14.4 Implement localStorage persistence of theme preference
- [ ] 14.5 Implement OS preference detection (prefers-color-scheme)
- [ ] 14.6 Create theme toggle button (sun/moon icon)
- [ ] 14.7 Apply theme colors to all UI components
- [ ] 14.8 Verify color contrast meets WCAG AA standards
- [ ] 14.9 Smooth transition animation when switching themes
- [ ] 14.10 Create theme tests

## 15. Keyboard Support

- [ ] 15.1 Implement number key input (0-9)
- [ ] 15.2 Implement operator key input (+, -, *, /)
- [ ] 15.3 Implement decimal point (.)
- [ ] 15.4 Implement Backspace for deletion
- [ ] 15.5 Implement Enter/Return to submit calculation
- [ ] 15.6 Implement Escape to clear expression
- [ ] 15.7 Create keyboard shortcut reference (display or help)
- [ ] 15.8 Implement Tab navigation between buttons
- [ ] 15.9 Implement Space to activate focused button
- [ ] 15.10 Implement arrow keys for history navigation
- [ ] 15.11 Test keyboard-only operation (no mouse required)
- [ ] 15.12 Create keyboard navigation tests

## 16. Responsive Design

- [ ] 16.1 Define Tailwind breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- [ ] 16.2 Create mobile-first layout (320px+)
- [ ] 16.3 Ensure buttons are 44x44px minimum for touch
- [ ] 16.4 Implement tablet layout optimization (768px+)
- [ ] 16.5 Implement desktop layout optimization (1024px+)
- [ ] 16.6 Test landscape/portrait orientation handling
- [ ] 16.7 Verify no horizontal scrolling on any viewport
- [ ] 16.8 Responsive text sizing (readable on all screens)
- [ ] 16.9 Responsive spacing and padding
- [ ] 16.10 Test on actual mobile devices (iOS, Android)
- [ ] 16.11 Create responsive design tests

## 17. Animations and Transitions

- [ ] 17.1 Add button press animations (Framer Motion scale)
- [ ] 17.2 Add button hover effects
- [ ] 17.3 Add display update animation (fade/slide result)
- [ ] 17.4 Add history panel slide animation
- [ ] 17.5 Add theme transition animation
- [ ] 17.6 Add error shake/bounce animation
- [ ] 17.7 Add focus ring animation for keyboard navigation
- [ ] 17.8 Implement prefers-reduced-motion support
- [ ] 17.9 Profile animation performance
- [ ] 17.10 Test animations don't impact accessibility

## 18. Accessibility

- [ ] 18.1 Add ARIA labels to all buttons
- [ ] 18.2 Add ARIA descriptions for complex components
- [ ] 18.3 Ensure semantic HTML structure
- [ ] 18.4 Test with keyboard navigation only
- [ ] 18.5 Test with screen reader (NVDA/JAWS)
- [ ] 18.6 Verify color contrast ratios (WCAG AA minimum)
- [ ] 18.7 Ensure focus indicators are visible
- [ ] 18.8 Test with browser accessibility inspector

## 19. Testing

- [ ] 19.1 Set up Jest/Vitest for unit testing
- [ ] 19.2 Set up React Testing Library for component tests
- [ ] 19.3 Create parser unit test suite (>90% coverage)
- [ ] 19.4 Create evaluator unit test suite (edge cases, errors)
- [ ] 19.5 Create Display component tests
- [ ] 19.6 Create ButtonGrid component tests
- [ ] 19.7 Create useCalculator hook tests
- [ ] 19.8 Create integration tests (user workflows)
- [ ] 19.9 Create keyboard navigation tests
- [ ] 19.10 Create theme switching tests
- [ ] 19.11 Create API integration tests
- [ ] 19.12 Target 80%+ code coverage overall

## 20. Documentation

- [ ] 20.1 Create CONTRIBUTING.md for developers
- [ ] 20.2 Document API endpoint (POST /api/calculate)
- [ ] 20.3 Document supported functions and constants
- [ ] 20.4 Create keyboard shortcuts reference
- [ ] 20.5 Create troubleshooting guide
- [ ] 20.6 Document calculator precision and limitations
- [ ] 20.7 Add inline code comments for complex logic
- [ ] 20.8 Create deployment documentation
- [ ] 20.9 Create architecture overview document

## 21. GitHub Pages Deployment

- [ ] 21.1 Create GitHub Actions workflow file
- [ ] 21.2 Configure Vite output for GitHub Pages base path
- [ ] 21.3 Build frontend production bundle
- [ ] 21.4 Configure GitHub Pages to deploy from gh-pages branch
- [ ] 21.5 Test deployment workflow on push to main
- [ ] 21.6 Verify GitHub Pages site is live and accessible
- [ ] 21.7 Add build status badge to README
- [ ] 21.8 Set up automatic cache busting for assets
- [ ] 21.9 Configure custom domain (if applicable)

## 22. Docker Setup

- [ ] 22.1 Create Dockerfile for backend (Node.js + Express)
- [ ] 22.2 Create .dockerignore to exclude unnecessary files
- [ ] 22.3 Create docker-compose.yml for full-stack local development
- [ ] 22.4 Configure environment variables in docker-compose
- [ ] 22.5 Set up volume mounts for development (hot reload)
- [ ] 22.6 Add health checks to docker-compose services
- [ ] 22.7 Test Docker build and run locally
- [ ] 22.8 Create Docker deployment documentation
- [ ] 22.9 Test full stack with docker-compose up

## 23. Final Integration & Quality Assurance

- [ ] 23.1 End-to-end testing (full user workflows)
- [ ] 23.2 Performance testing (Lighthouse score)
- [ ] 23.3 Browser compatibility testing (Chrome, Firefox, Safari, Edge)
- [ ] 23.4 Mobile device testing (iOS, Android)
- [ ] 23.5 Load testing for backend API
- [ ] 23.6 Security review of parser and API
- [ ] 23.7 Accessibility audit (WCAG 2.1 AA compliance)
- [ ] 23.8 Code review and refactoring
- [ ] 23.9 Final bug fixes and polish

## 24. Release & Deployment

- [ ] 24.1 Create GitHub release with changelog
- [ ] 24.2 Deploy frontend to GitHub Pages (via Actions)
- [ ] 24.3 Build and test Docker image for backend
- [ ] 24.4 Push Docker image to Docker Hub (or GitHub Container Registry)
- [ ] 24.5 Verify production deployment
- [ ] 24.6 Monitor for errors in production
- [ ] 24.7 Set up issue templates for bug reports
- [ ] 24.8 Create release notes for users
