## ADDED Requirements

### Requirement: Dockerfile for backend service
The system SHALL include Dockerfile for containerizing the backend Express.js service.

#### Scenario: Dockerfile exists and builds
- **WHEN** running "docker build -t simplecalc-backend ."
- **THEN** Docker image builds successfully without errors

#### Scenario: Backend service runs in container
- **WHEN** running built Docker image
- **THEN** Express server starts and listens on configured port (e.g., 3001)

### Requirement: Docker Compose configuration
The system SHALL include docker-compose.yml for running full-stack application.

#### Scenario: Docker Compose starts services
- **WHEN** running "docker-compose up"
- **THEN** all services (frontend build, backend server) start successfully

#### Scenario: Services are accessible
- **WHEN** docker-compose is running
- **THEN** frontend is accessible at http://localhost:3000 and backend at http://localhost:3001

### Requirement: Multi-stage Docker build
The system SHALL use multi-stage builds to optimize image size.

#### Scenario: Optimized image size
- **WHEN** building Docker image
- **THEN** image contains only production dependencies, minimizing size

### Requirement: Environment configuration
The system SHALL support environment variables for Docker deployment.

#### Scenario: Configure backend port
- **WHEN** running container with environment variable PORT=8080
- **THEN** backend service listens on port 8080

#### Scenario: Configure frontend API endpoint
- **WHEN** running container
- **THEN** frontend correctly connects to backend API at configured URL

### Requirement: Volume mounting for development
The system SHALL support volume mounting for development with hot reload.

#### Scenario: Development with volume mount
- **WHEN** running docker-compose with volumes in dev mode
- **THEN** file changes in host machine are reflected in running container without rebuild

### Requirement: Health checks
The system SHALL include health check configuration for Docker services.

#### Scenario: Container health check
- **WHEN** running Docker container
- **THEN** container includes health check that verifies service is running properly

### Requirement: .dockerignore file
The system SHALL include .dockerignore to exclude unnecessary files from Docker image.

#### Scenario: Efficient image build
- **WHEN** building Docker image
- **THEN** node_modules, .git, and other unnecessary files are excluded, reducing context size

### Requirement: Docker Compose environment files
The system SHALL support .env files for Docker Compose configuration.

#### Scenario: Load environment from file
- **WHEN** .env file exists with configuration
- **THEN** docker-compose uses these settings for services

### Requirement: Container networking
The system SHALL configure proper networking for inter-service communication.

#### Scenario: Frontend to backend communication
- **WHEN** frontend container makes API request to backend
- **THEN** request is routed correctly within Docker network

### Requirement: Persistent data handling
The system SHALL handle persistent data (history) appropriately in containerized environment.

#### Scenario: History persistence in Docker
- **WHEN** running in Docker container
- **THEN** calculation history is properly stored and persists across container restarts

### Requirement: Documentation for Docker setup
The system SHALL include clear documentation for Docker setup and usage.

#### Scenario: Docker section in README
- **WHEN** viewing project README
- **THEN** Docker setup instructions are clear and include example commands
