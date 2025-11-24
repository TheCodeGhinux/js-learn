/**
 * USER ROUTES - Route Definitions
 * Routes define the API endpoints and map them to controller functions.
 * RESTful API Conventions:
 * - GET: Retrieve data
 * - POST: Create new data
 * - PUT/PATCH: Update existing data
 * - DELETE: Remove data
 * URL Structure:
 * - /users - Collection endpoint (all users)
 * - /users/:id - Individual resource endpoint (specific user)
 * - /users/search - Special action endpoint
 */

import { Router } from 'express';
import * as userController from '../controllers/user.js';
import { authMiddleware, logger, requestId } from '../middleware/index.js';
import { validateUser } from '../middleware/validation.js';
// import { logger } from '../middleware/custom.js';
// import { authMiddleware } from '../middleware/authMiddleware.js';
// import { validateUser } from '../middleware/validation.js';

const router = Router();

/**
 * PUBLIC ROUTES (no authentication required)
 */

// GET /users?page=1&limit=10 - Get all users with pagination
router.get('/', userController.getUsers);

// GET /users/search?q=john - Search users by name
// Note: This must come BEFORE /:id route to avoid conflict
router.get('/search', userController.searchUsers);

// router.use(authMiddleware)
// GET /users/age-range?min=20&max=30 - Filter by age
router.get('/age-range', userController.getUsersByAge);

// GET /users/:id - Get single user by ID
router.get('/:id', logger, requestId, userController.getUser);


//  PROTECTED ROUTES (authentication required)
  // These routes use authMiddleware to verify the user is authenticated.
  // You can apply middleware in several ways:
  // To a single route:
    router.post("/", validateUser, userController.createUser)
  // To multiple routes:
    router.use(authMiddleware); // All routes after this are protected
//  To specific routes:
  // router.post("/", [authMiddleware, otherMiddleware], userController.createUser)


// POST /users - Create new user (requires auth + validation)
// router.post('/', authMiddleware, validateUser, userController.createUser);

// // PUT /users/:id - Update user (requires auth)
// router.put('/:id', authMiddleware, userController.updateUser);

// // DELETE /users/:id - Delete user (requires auth)
// router.delete('/:id', authMiddleware, userController.deleteUser);



export default router;
