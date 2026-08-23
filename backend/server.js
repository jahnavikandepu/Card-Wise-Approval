import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import applicationRoutes from './routes/applicationRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware Configuration
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CardWise backend is running',
    timestamp: new Date().toISOString()
  });
});

// 2. Application REST API Routes
app.use('/api/applications', applicationRoutes);

// 3. Centralized 404 and Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 CardWise Backend running on port ${PORT}`);
  console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Allowed Client Origin: ${CLIENT_URL}`);
  console.log(`=========================================`);
});

// Graceful shutdown handling
process.on('unhandledRejection', (err) => {
  console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
});

export default app;
