/**
 * USER SERVICE - Data Layer
 *
 * This service handles all data operations for users.
 * It acts as an abstraction layer between controllers and data storage.
 *
 * Benefits of separating services:
 * - Single Responsibility: Each function does one thing
 * - Reusability: Can be used by multiple controllers
 * - Testability: Easy to unit test without HTTP layer
 * - Maintainability: Changes to data logic don't affect controllers
 */

// In-memory data store (in production, this would be a database)
let users = [
  { id: 1, name: 'Rachael', age: 23 },
  { id: 2, name: 'John', age: 22 },
  { id: 3, name: 'Michael', age: 21 },
  { id: 4, name: 'Isael', age: 28 },
  { id: 5, name: 'Ayomide', age: 22 },
  { id: 6, name: 'David', age: 30 },
  { id: 7, name: 'Queen', age: 33 },
  { id: 8, name: 'Ivy', age: 23 },
  { id: 9, name: 'Joe', age: 23 },
  { id: 10, name: 'Josh', age: 27 },
  { id: 11, name: 'Jane', age: 29 },
  { id: 12, name: 'Doe', age: 23 },
  { id: 13, name: 'Sarah', age: 23 },
];




class UserService {
  

  getUsers(){}
  getUsers(){}
  getUsersById(){}
}




/**
 * Get all users with pagination
 *
 * Pagination helps when dealing with large datasets:
 * - Reduces memory usage
 * - Faster response times
 * - Better user experience
 *
 * @param {number} page - Current page number (1-indexed)
 * @param {number} limit - Number of items per page
 * @returns {Object} Paginated user data with metadata
 */
export const getAllUsers = (page = 1, limit = 10) => {
  // Calculate array slice indices
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Calculate total pages for pagination metadata
  const totalPages = Math.ceil(users.length / limit);

  return {
    total: users.length,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    data: users.slice(startIndex, endIndex),
  };
};

/**
 * Get a single user by ID
 *
 * @param {number|string} id - User ID to search for
 * @returns {Object|null} User object or null if not found
 */
export const getUserById = (id) => {
  // Convert id to number for comparison (handles both string and number inputs)
  const user = users.find((u) => u.id === Number(id));
  return user || null;
};

/**
 * Create a new user
 *
 * @param {Object} userData - User data to create
 * @param {string} userData.name - User's name
 * @param {number} userData.age - User's age
 * @returns {Object} Newly created user
 * @throws {Error} If validation fails
 */
export const createUser = (userData) => {
  const { name, age } = userData;

  // Validation: Check for required fields
  if (!name || !age) {
    throw new Error('Name and age are required fields');
  }

  // Validation: Check if name already exists
  const existingUser = users.find(
    (u) => u.name.toLowerCase() === name.toLowerCase()
  );

  if (existingUser) {
    throw new Error('User with this name already exists');
  }

  // Generate new ID (in production, database would handle this)
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

  const newUser = {
    id: newId,
    name,
    age: Number(age),
  };

  users.push(newUser);
  return newUser;
};

/**
 * Update an existing user
 *
 * @param {number|string} id - User ID to update
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated user
 * @throws {Error} If user not found
 */
export const updateUser = (id, updates) => {
  const userIndex = users.findIndex((u) => u.id === Number(id));

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Merge existing user data with updates
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    id: users[userIndex].id, // Prevent ID from being changed
  };

  return users[userIndex];
};







/**
 * Delete a user by ID
 *
 * @param {number|string} id - User ID to delete
 * @returns {Object} Deleted user
 * @throws {Error} If user not found
 */
export const deleteUser = (id) => {
  const userIndex = users.findIndex((u) => u.id === Number(id));

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Remove user from array and return the deleted user
  const [deletedUser] = users.splice(userIndex, 1);
  return deletedUser;
};

/**
 * Search users by name (case-insensitive partial match)
 *
 * @param {string} query - Search query
 * @returns {Array} Matching users
 */
export const searchUsers = (query) => {
  if (!query) return users;

  const lowerQuery = query.toLowerCase();
  return users.filter((u) => u.name.toLowerCase().includes(lowerQuery));
};

/**
 * Get users filtered by age range
 *
 * @param {number} minAge - Minimum age (inclusive)
 * @param {number} maxAge - Maximum age (inclusive)
 * @returns {Array} Filtered users
 */
export const getUsersByAgeRange = (minAge, maxAge) => {
  return users.filter((u) => u.age >= minAge && u.age <= maxAge);
};
