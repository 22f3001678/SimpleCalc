import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import calculateRouter from './routes/calculate.js';
import { requestLogger, detailedRequestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================================
// CORS Configuration
// ============================================================================
// Allow requests from frontend (adjust for production)
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

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
  console.log(`
╔════════════════════════════════════════╗
║     SimpleCalc Backend Server         ║
╠════════════════════════════════════════╣
║ Environment:   ${NODE_ENV.padEnd(26)}║
║ Port:          ${PORT.toString().padEnd(26)}║
║ CORS Origin:   ${(process.env.CORS_ORIGIN || 'http://localhost:5173').substring(0, 26).padEnd(26)}║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
