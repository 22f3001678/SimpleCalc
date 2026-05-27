# Docker & Local Compose

This document explains how to build and run the full stack using Docker and Compose.

Prerequisites
- Docker Engine
- Docker Compose (v2 or compatible)

Build images (production)

```bash
# from repository root
docker compose build

# Start services (background)
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

Development with hot-reload

The project includes `docker-compose.override.yml` which enables bind mounts and runs dev servers for fast development. Start with:

```bash
docker compose up

# frontend dev: http://localhost:4173
# backend dev: http://localhost:3001
```

Health checks

The `docker-compose.yml` includes `healthcheck` definitions for `backend` and `frontend`. The checks use simple HTTP probes; ensure your backend exposes a `/health` endpoint that returns HTTP 200 for reliable checks.

Notes
- The override file is intentionally conservative — it runs `npm run dev` in the containers so that code changes are picked up immediately via the mounted volumes.
- If you need to deploy to production, use the production build (`npm run build` in the frontend) and serve the built files with a static server image or let the workflow push the built `frontend/dist` to GitHub Pages.

Troubleshooting
- If the health check fails, inspect container logs with `docker compose logs <service>` and verify the health endpoint is implemented.
- If ports conflict, update `docker-compose.yml` or stop local services using those ports.
