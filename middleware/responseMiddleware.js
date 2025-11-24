/**
 * RESPONSE FORMATTER MIDDLEWARE
 *
 * Adds custom response methods to the res object for consistent API responses.
 * This ensures all API responses follow the same structure.
 *
 * Benefits:
 * - Consistency across all endpoints
 * - Easier for frontend to parse responses
 * - Reduces code duplication in controllers
 * - Centralized response logic
 */

/**
 * Standard API Response Format:
 * {
 *   success: boolean,
 *   message: string,
 *   data: any,
 *   timestamp: string,
 *   path: string
 * }
 */

export const responseFormatter = (req, res, next) => {
  /**
   * Success response helper
   *
   * @param {*} data - Data to send in response
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  res.success = (data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  };

  /**
   * Error response helper
   *
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 400)
   * @param {*} errors - Additional error details (optional)
   */
  res.error = (message = 'Error', statusCode = 400, errors = null) => {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    };

    // Include additional error details if provided
    if (errors) {
      response.errors = errors;
    }

    res.status(statusCode).json(response);
  };

  /**
   * Paginated response helper
   *
   * @param {Array} data - Array of items
   * @param {Object} pagination - Pagination metadata
   * @param {string} message - Success message
   */
  res.paginated = (
    data,
    pagination,
    message = 'Data retrieved successfully'
  ) => {
    res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
        hasNextPage: pagination.hasNextPage,
        hasPrevPage: pagination.hasPrevPage,
      },
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  };

  /**
   * Created response helper (201)
   * Specifically for resource creation
   *
   * @param {*} data - Created resource
   * @param {string} message - Success message
   */
  res.created = (data, message = 'Resource created successfully') => {
    res.status(201).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  };

  /**
   * No content response helper (204)
   * For successful requests that don't return data
   */
  res.noContent = () => {
    res.status(204).send();
  };

  next();
};
