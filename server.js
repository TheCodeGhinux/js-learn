/**
 * MAIN EXPRESS APPLICATION
 * 
 * This file sets up and configures the Express application.
 * 
 * Key Concepts:
 * 1. Middleware execution order matters
 * 2. Route definitions come after middleware setup
 * 3. Error handlers come last
 * 4. Each app.use() adds to the middleware stack
 */

import express from 'express';
import userRoutes from './routes/user.js';
import healthRoutes from './routes/health.js'

// Import middleware
// import { 
//   logger, 
//   requestId, 
//   corsMiddleware,
//   rateLimit,
//   errorHandler,
//   notFound 
// } from './middleware/custom.js';
import { responseFormatter } from './middleware/responseMiddleware.js';
import { logger, rateLimit, requestId } from './middleware/index.js';
import { sanitizeInput } from './middleware/validation.js';

/**
 * INITIALIZE EXPRESS APP
 */
const app = express();
const PORT = process.env.PORT || 3004;

/**
 * GLOBAL MIDDLEWARE
 * 
 * Order is important! Middleware executes in the order it's defined.
 */

// 1. Request ID - Add unique ID to each request (first for logging)
app.use(requestId);

// 2. Logger - Log all incoming requests
app.use(logger);


// 3. Body Parser from express - Parse JSON request bodies
app.use(express.json());

// 4. URL-encoded Parser - Parse form data
app.use(express.urlencoded({ extended: true }));

// 5. Input Sanitization - Clean user input
app.use(sanitizeInput);

// 6. Response Formatter - Add custom response methods
app.use(responseFormatter);

// 8. Rate Limiting - Prevent abuse (100 requests per 15 minutes)
app.use(rateLimit(20, 15 * 60 * 1000));

/**
 * ROUTES
 * 
 * Define API endpoints
 */

app.use('/test', healthRoutes)
// Mount user routes
// All routes in userRoutes will be prefixed with /users
app.use('/users', userRoutes);


app.listen(PORT, () => {
  console.log("===============================================");
  console.log(`🚀Server started on port: ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log("===============================================");
  
})
