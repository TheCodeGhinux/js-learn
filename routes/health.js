import { Router } from "express";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const router = Router()


// Health check endpoint
const health = ('/', (req, res) => {
  res.success({
    status: 'running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      users: '/users',
      health: '/health'
    }
  }, 'Server is running');
});

// Detailed health check
export const healthy =('/health', (req, res) => {
  res.success({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  }, 'Health check passed');
});

router.get("/", health)
router.get("/health", healthy)

