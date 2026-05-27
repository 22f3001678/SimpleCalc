# SimpleCalc — Scientific Calculator

<!-- GitHub Actions status badge (frontend build & deploy) -->
[![Frontend Build & Deploy](https://github.com/22f3001678/SimpleCalc/actions/workflows/frontend-deploy.yml/badge.svg)](https://github.com/22f3001678/SimpleCalc/actions/workflows/frontend-deploy.yml)

<!-- GitHub Pages site -->
[Live demo (GitHub Pages)](https://22f3001678.github.io/SimpleCalc/)

SimpleCalc is a TI-style scientific calculator implemented with a secure backend parser/evaluator and a polished React frontend (Vite + TailwindCSS). This repository holds the implementation, documentation, and deployment artifacts for development and production.

This workspace contains the frontend (React/Vite) and backend (Node.js/Express) within a monorepo layout. Key folders:

- `frontend/` — React app (Vite + TailwindCSS, supports GitHub Pages deployment)
- `backend/` — Node.js + Express API (secure tokenizer, validator, evaluator pipeline)
- `.github/workflows/` — CI workflows for tests, build, and deploy
- `docker-compose.yml` — local production-like run of backend + frontend

The `sdd_submission` branch contains the structured implementation used for submissions and formal review.

---

# Repository Structure

```txt
main
├── Documentation
├── README.md
└── Project Overview

vibe_coded_submission
├── React + Tailwind calculator
├── Scientific mode
├── Animated UI
└── GitHub Pages deployment

sdd_submission
├── OpenSpec implementation
├── Structured architecture
├── Engineering documentation
└── Software design workflow
```

---

# Features

## Common Features

- Basic arithmetic operations
- Scientific functions
- Responsive layout
- Modern calculator interface

## Vibe-Coded Submission

- TailwindCSS-based UI
- Animated calculator buttons
- Glassmorphism styling
- Calculation history
- Rapid iterative development

## SDD/OpenSpec Submission

- Structured component architecture
- Documented development workflow
- Modular design
- Maintainable codebase
- Engineering-focused implementation

---

# Tech Stack

- React
- Vite
- TailwindCSS
- JavaScript

---

# Branches

| Branch | Purpose |
|---|---|
| `main` | Documentation and repository overview |
| `vibe_coded_submission` | Rapidly vibe-coded implementation |
| `sdd_submission` | OpenSpec / SDD-based implementation |

---


## Getting started (development)

Clone the repository and install dependencies for both packages:

```bash
git clone <repo-url>
cd SimpleCalc
```

Install and run backend and frontend separately during development:

Backend
```bash
cd backend
npm ci
npm run dev
# server: http://localhost:3001
```

Frontend
```bash
cd frontend
npm ci
npm run dev
# dev server: http://localhost:4173
```

Environment is configurable via `backend/.env` and `frontend/.env` or environment variables. Example values are provided in `.env.example`.

---


## Build & deployment

Production build (frontend)
```bash
cd frontend
npm run build
# output: frontend/dist/
```

GitHub Pages
- `VITE_BASE` controls the base path in `vite.config.js`. For GitHub Pages set `VITE_BASE` to `/<repo-name>/` and configure `.github/workflows/frontend-deploy.yml` (already included) to publish `frontend/dist` to the `gh-pages` branch.

Docker (local production-like)
```bash
docker-compose build
docker-compose up
# frontend: http://localhost:8080
# backend: http://localhost:3001
```

---

# Scientific Functions

| Function | Example |
|---|---|
| Square Root | `sqrt(25)` |
| Sine | `sin(1)` |
| Cosine | `cos(1)` |
| Tangent | `tan(1)` |
| Log Base 10 | `log(100)` |
| Power | `2^3` |

---


## Accessibility & QA

- The UI includes ARIA live regions and keyboard support; `:focus-visible` styles are provided for keyboard users.
- Reduced-motion preference is respected via `prefers-reduced-motion` CSS rules.
- Touch targets and button sizing have been optimized for mobile devices.

## Testing

- Frontend: Vitest + Testing Library (placeholder tests included). Run with `cd frontend && npm run test`.
- Backend: Jest + Supertest (placeholder tests included). Run with `cd backend && npm test`.

## Contributing & development notes

- Update `backend/.env` `CORS_ORIGIN` with comma-separated origins for local dev (e.g. `http://localhost:5173,http://localhost:4173`).
- Use `npm run build` in `frontend` to verify production build before deploying.

---

For more detailed developer tasks and the design rationale see `openspec/changes/simplecalc/` and `QUICK_REFERENCE.md`.

---

# License

MIT License