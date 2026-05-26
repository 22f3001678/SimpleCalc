# T1 Scientific Calculator

A modern React + TailwindCSS scientific calculator inspired by classic T1/TI-style calculators.

This repository contains two separate implementations of the calculator project:

- `vibe_coded_submission`
  - Rapidly developed "vibe-coded" implementation
  - Focused on UI, animations, responsiveness, and fast iteration

- `sdd_submission`
  - Structured implementation developed using OpenSpec / Software Design Documentation workflow
  - Focused on maintainability, architecture, and engineering practices

The `main` branch contains:
- Documentation
- Project overview
- Setup instructions
- Submission details

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

# Getting Started

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/t1-calculator.git
```

Move into the project:

```bash
cd t1-calculator
```

Switch to a branch:

```bash
git checkout vibe_coded_submission
```

or

```bash
git checkout sdd_submission
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

# GitHub Pages Deployment

Install deployment dependency:

```bash
npm install gh-pages --save-dev
```

Update `package.json`:

```json
"homepage": "https://YOUR_USERNAME.github.io/t1-calculator"
```

Add deploy scripts:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "deploy": "gh-pages -d dist"
}
```

Update `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/t1-calculator/"
})
```

Deploy:

```bash
npm run build
npm run deploy
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

# Future Improvements

- Graph plotting
- Persistent history
- Better expression parser
- Keyboard shortcuts
- PWA support
- Matrix operations
- Equation solver
- Multiple calculator themes

---

# License

MIT License