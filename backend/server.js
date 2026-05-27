import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import calculateRouter from './routes/calculate.js';
import { requestLogger, detailedRequestLogger, log } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================================
// CORS Configuration
// ============================================================================
// Allow requests from frontend (adjust for production)
// Support comma-separated CORS_ORIGIN env var or sensible dev defaults.
const rawOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:4173,http://localhost:8080';
const allowedOrigins = rawOrigins.split(',').map((s) => s.trim()).filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // Allow non-browser requests (e.g., curl, server-to-server)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS policy: origin ${origin} not allowed`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use((req, res, next) => {
  // Wrap cors middleware to handle errors gracefully and surface helpful messages
  return cors(corsOptions)(req, res, (err) => {
    if (err) {
      // Log and respond with a CORS-friendly error
      log.warn('[CORS] Rejected origin', { origin: req.get('origin') });
      res.status(403).json({ error: 'CORS origin not allowed' });
      return;
    }
    next();
  });
});

// ============================================================================
// Body Parser Middleware
// ============================================================================
// Parse JSON request bodies (max 1MB)
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

// ============================================================================
// Request Logging Middleware
// ============================================================================
app.use(requestLogger);
app.use(detailedRequestLogger);

// ============================================================================
// Health Check Endpoint
// ============================================================================
// Simple endpoint to verify backend is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// API Routes
// ============================================================================
app.use('/api/calculate', calculateRouter);

// ============================================================================
// Health Check & Info Routes
// ============================================================================
app.get('/api/config', (req, res) => {
  res.json({
    decimalPlaces: 10,
    allowedFunctions: [
      'sin', 'cos', 'tan',
      'asin', 'acos', 'atan',
      'sqrt', 'log', 'ln',
      'abs'
    ],
    constants: {
      'π': Math.PI,
      'e': Math.E,
    },
    version: '1.0.0',
  });
});

// ============================================================================
// 404 Handler
// ============================================================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method,
  });
});

// ============================================================================
// Error Handling Middleware
// ============================================================================
app.use(errorHandler);

// ============================================================================
// Server Startup
// ============================================================================
const server = app.listen(PORT, () => {
  log.info('SimpleCalc Backend Server started', {
    environment: NODE_ENV,
    port: PORT,
    corsOrigins: allowedOrigins,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    log.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  log.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    log.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
