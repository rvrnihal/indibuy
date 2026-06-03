import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging Middleware
app.use(morgan('combined'));

// API Routes (to be implemented)
app.use('/api/auth', (req, res) => {
  res.json({ message: 'Auth routes coming soon' });
});

app.use('/api/products', (req, res) => {
  res.json({ message: 'Products routes coming soon' });
});

app.use('/api/orders', (req, res) => {
  res.json({ message: 'Orders routes coming soon' });
});

app.use('/api/vendors', (req, res) => {
  res.json({ message: 'Vendors routes coming soon' });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'IndiBuy Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║     IndiBuy Backend Server Started    ║
║     Environment: ${process.env.NODE_ENV}          ║
║     Port: ${PORT}                          ║
║     Time: ${new Date().toISOString()}  ║
╚═══════════════════════════════════════╝
  `);
});

export default app;
