import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import storesRoutes from './routes/stores.js';
import ownerRoutes from './routes/owner.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup - allow all origins since frontend is served from same server
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple request logger - TODO: maybe use morgan in production?
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/owner', ownerRoutes);

// Serve frontend static files
const frontendPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '../frontend/dist')
  : path.join(__dirname, '../../frontend/dist');
  
app.use(express.static(frontendPath));

// error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.status || 500;
  const response = {
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR'
    }
  };
  
  // add stack trace in dev mode
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
});

// Handle React routing - send all other requests to index.html (must be last)
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
});

export default app;
