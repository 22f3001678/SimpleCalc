# Deployment Guide

# Local Development

## Frontend

Move into frontend directory:

```bash
cd frontend
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

## Backend

Move into backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start backend server:

```bash
npm run dev
```

---

# Docker Deployment

Run containers:

```bash
docker-compose up --build
```

Stop containers:

```bash
docker-compose down
```

---

# GitHub Pages Deployment

## Install gh-pages

```bash
npm install gh-pages --save-dev
```

---

## Configure package.json

```json
"homepage": "https://YOUR_USERNAME.github.io/SimpleCalc"
```

---

## Deploy

```bash
npm run build
npm run deploy
```

---

# GitHub Actions

The repository includes GitHub Actions workflows for:

- Frontend CI
- Backend CI
- Deployment automation

Workflow files are located in:

```txt
.github/workflows/
```

---

# Recommended Hosting

| Service | Purpose |
|---|---|
| GitHub Pages | Frontend hosting |
| Render | Backend hosting |
| Railway | Backend hosting |
| Docker | Container deployment |

---

# Environment Variables

## Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

## Backend

```env
PORT=5000
NODE_ENV=development
```