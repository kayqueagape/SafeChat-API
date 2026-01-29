import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

// Load environment variables
dotenv.config();

// Connect database
import { connectDatabase } from './app/config/database.js';

// Import routes
import authRoutes from './app/routes/auth.js';
import roomsRoutes from './app/routes/rooms.js';

// Import middleware
import { errorHandler, notFoundHandler } from './app/middleware/errorHandler.js';

// Import Swagger
import { swaggerSpec } from './app/config/swagger.js';

// Import Socket.io
import { initializeSocket } from './app/tools/socket.js';

// Import face recognition models loader
import { loadModels } from './app/utils/faceRecognition.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDatabase().catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SafeChat API is running',
    timestamp: new Date().toISOString()
  });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SafeChat API Documentation'
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🛡️ SafeChat API - Secure Real-Time Messaging',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health'
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize Socket.io
const io = initializeSocket(server);

// Load face recognition models
loadModels().catch((error) => {
  console.error('Failed to load face recognition models:', error);
});

// Start server
server.listen(PORT, () => {
  console.log(`
  🚀 SafeChat API Server
  📍 Port: ${PORT}
  📖 Documentation: http://localhost:${PORT}/api-docs
  ❤️  Health Check: http://localhost:${PORT}/health
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

export { app, server, io };
