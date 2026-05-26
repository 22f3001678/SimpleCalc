# Architecture Documentation

# Overview

SimpleCalc follows a modular full-stack architecture using:

- React frontend
- Node.js backend
- REST API communication

---

# High-Level Architecture

```txt
Frontend (React + Tailwind)
        |
        | HTTP Requests
        v
Backend API (Node.js + Express)
        |
        v
Calculation Services / Storage
```

---

# Frontend Architecture

## Responsibilities

- UI rendering
- User interaction handling
- Expression input
- History display
- Scientific function support

## Main Components

| Component | Purpose |
|---|---|
| Calculator | Main calculator logic |
| Display | Output display |
| Button | Calculator button |
| ScientificPanel | Scientific operations |
| History | Calculation history |

---

# Backend Architecture

## Responsibilities

- Expression evaluation
- History management
- API responses
- Validation
- Error handling

## Main Layers

```txt
Routes
  ↓
Controllers
  ↓
Services
  ↓
Utilities / Models
```

---

# Directory Structure

```txt
frontend/
backend/
docs/
.github/
```

---

# Design Principles

- Modular structure
- Reusable components
- Separation of concerns
- Maintainability
- Scalability

---

# Future Improvements

- Database integration
- Authentication
- Docker deployment
- WebSocket support
- Advanced parser engine
- Graph rendering