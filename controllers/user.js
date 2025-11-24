/**
 * USER CONTROLLER - Request/Response Layer
 *
 * Controllers handle HTTP requests and responses.
 * They should be thin - only handling:
 * - Request validation
 * - Calling service functions
 * - Sending responses
 * - Error handling
 *
 * Business logic belongs in services, not controllers.
 */

import * as UserService from '../services/user.js';

/**
 * GET /users - Get all users with pagination
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 *
 * Example: GET /users?page=2&limit=5
 */
export const getUsers = (req, res) => {
  try {
    // Extract and parse query parameters with defaults
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page and limit must be positive numbers',
      });
    }

    if (limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit cannot exceed 100 items',
      });
    }

    // Call service function
    const result = UserService.getAllUsers(page, limit);

    // Send successful response using custom middleware
    res.success(result, 'Users fetched successfully', 200);
  } catch (error) {
    // Error handling - pass to error middleware
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

/**
 * GET /users/:id - Get a single user by ID
 *
 * URL Parameters:
 * - id: User ID
 *
 * Example: GET /users/5
 */
export const getUser = (req, res) => {
  try {
    const userId = req.params.id;

    // Validate ID format
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    const user = UserService.getUserById(userId);

    // Handle user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`,
      });
    }

    res.success(user, 'User fetched successfully', 200);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

/**
 * POST /users - Create a new user
 *
 * Request Body:
 * - name: string (required)
 * - age: number (required)
 *
 * Example: POST /users
 * Body: { "name": "Alice", "age": 25 }
 */
export const createUser = (req, res) => {
  try {
    const { name, age } = req.body;

    // Basic validation (could be moved to validation middleware)
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid name is required',
      });
    }

    if (!age || isNaN(age) || age < 0 || age > 150) {
      return res.status(400).json({
        success: false,
        message: 'Valid age (0-150) is required',
      });
    }

    // Call service to create user
    const newUser = UserService.createUser({
      name: name.trim(),
      age: Number(age),
    });

    // 201 = Created
    res.success(newUser, 'User created successfully', 201);
  } catch (error) {
    // Handle specific service errors
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        // 409 = Conflict
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
};

/**
 * PUT /users/:id - Update an existing user
 *
 * URL Parameters:
 * - id: User ID
 *
 * Request Body (all optional):
 * - name: string
 * - age: number
 *
 * Example: PUT /users/5
 * Body: { "age": 26 }
 */
export const updateUser = (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Validate ID
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    // Validate updates object is not empty
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update data provided',
      });
    }

    // Validate individual fields if provided
    if (
      updates.name !== undefined &&
      (typeof updates.name !== 'string' || updates.name.trim().length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid name format',
      });
    }

    if (
      updates.age !== undefined &&
      (isNaN(updates.age) || updates.age < 0 || updates.age > 150)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid age value',
      });
    }

    // Update user
    const updatedUser = UserService.updateUser(userId, updates);

    res.success(updatedUser, 'User updated successfully', 200);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

/**
 * DELETE /users/:id - Delete a user
 *
 * URL Parameters:
 * - id: User ID
 *
 * Example: DELETE /users/5
 */
export const deleteUser = (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    const deletedUser = UserService.deleteUser(userId);

    res.success(deletedUser, 'User deleted successfully', 200);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

/**
 * GET /users/search - Search users by name
 *
 * Query Parameters:
 * - q: Search query
 *
 * Example: GET /users/search?q=john
 */
export const searchUsers = (req, res) => {
  try {
    const query = req.query.q || '';

    const results = UserService.searchUsers(query);

    res.success(
      {
        query,
        count: results.length,
        data: results,
      },
      'Search completed successfully',
      200
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching users',
      error: error.message,
    });
  }
};

/**
 * GET /users/age-range - Filter users by age range
 *
 * Query Parameters:
 * - min: Minimum age
 * - max: Maximum age
 *
 * Example: GET /users/age-range?min=20&max=30
 */
export const getUsersByAge = (req, res) => {
  try {
    const minAge = Number(req.query.min) || 0;
    const maxAge = Number(req.query.max) || 150;

    if (minAge < 0 || maxAge < 0 || minAge > maxAge) {
      return res.status(400).json({
        success: false,
        message: 'Invalid age range',
      });
    }

    const results = UserService.getUsersByAgeRange(minAge, maxAge);

    res.success(
      {
        ageRange: { min: minAge, max: maxAge },
        count: results.length,
        data: results,
      },
      'Users filtered successfully',
      200
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error filtering users',
      error: error.message,
    });
  }
};
