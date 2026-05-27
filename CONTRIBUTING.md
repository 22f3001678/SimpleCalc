# Contributing to SimpleCalc

Thanks for your interest in contributing! This document describes the recommended workflow, code standards, and how to run the project locally.

Prerequisites
- Node.js (LTS recommended; Node >= 18)
- npm

Getting started
1. Fork the repository and create a feature branch: `git checkout -b feat/your-change`.
2. Install dependencies for both packages:

```bash
cd frontend
npm install
cd ../backend
npm install
```

Running locally
- Start the backend (from the `backend` folder):

```bash
npm run dev
```

- Start the frontend (from the `frontend` folder):

```bash
npm run dev
```

Testing
- Run the test suite:

```bash
cd frontend
npx vitest run --coverage
```

- Quick test during development:

```bash
npm run test:ci -- src/__tests__/SomeTestFile.test.jsx
```

Guidelines
- Keep PRs small and focused; one logical change per PR.
- Include tests for new behavior and run the full test suite locally before opening a PR.
- Update `openspec/changes/simplecalc/tasks.md` if you complete or change project-level tasks.

Code style
- Follow existing code conventions (React function components, named exports where used, Tailwind classes for styling).
- Avoid unrelated refactors in the same PR.

Commit messages
- Use concise, descriptive messages. Prefer present-tense: `Add feature X`, `Fix bug in Y`.

Pull request checklist
- [ ] Branch builds and tests pass locally
- [ ] Changes are covered by tests where appropriate
- [ ] Documentation updated if public behavior changed

If you need help, open an issue with a reproducible example and link it to your pull request.

Thank you for improving SimpleCalc!
