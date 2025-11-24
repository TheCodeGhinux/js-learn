/**
 * VALIDATION MIDDLEWARE
 *
 * Validates incoming request data before it reaches controllers.
 * This separates validation logic from business logic.
 *
 * Benefits:
 * - Consistent validation across routes
 * - Early rejection of invalid requests
 * - Clear error messages for clients
 * - Reusable validation rules
 *
 * In production, consider using libraries like:
 * - Joi
 * - Yup
 * - express-validator
 * - Zod
 */

/**
 * GENERIC VALIDATION HELPER
 *
 * Creates a validation middleware from a schema object
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    // Validate each field in schema
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      // Check required
      if (
        rules.required &&
        (value === undefined || value === null || value === '')
      ) {
        errors.push(`${field} is required`);
        continue;
      }

      // Skip further validation if field is optional and not provided
      if (!rules.required && (value === undefined || value === null)) {
        continue;
      }

      // Check type
      if (rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`);
      }

      // Check min length (for strings)
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }

      // Check max length (for strings)
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must not exceed ${rules.maxLength} characters`);
      }

      // Check min value (for numbers)
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`);
      }

      // Check max value (for numbers)
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`${field} must not exceed ${rules.max}`);
      }

      // Check pattern (regex)
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }

      // Custom validator
      if (rules.validator) {
        const customError = rules.validator(value);
        if (customError) {
          errors.push(customError);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    next();
  };
};

/**
 * USER VALIDATION SCHEMA
 *
 * Defines validation rules for user data
 */
const userSchema = {
  name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 50,
    validator: (value) => {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return 'Name must contain only letters and spaces';
      }
      return null;
    },
  },
  age: {
    required: true,
    type: 'number',
    min: 0,
    max: 150,
  },
};

/**
 * PRE-BUILT VALIDATION MIDDLEWARE
 */
export const validateUser = validate(userSchema);

/**
 * UPDATE USER VALIDATION
 *
 * For updates, all fields are optional but must be valid if provided
 */
const updateUserSchema = {
  name: {
    required: false,
    type: 'string',
    minLength: 2,
    maxLength: 50,
    validator: (value) => {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return 'Name must contain only letters and spaces';
      }
      return null;
    },
  },
  age: {
    required: false,
    type: 'number',
    min: 0,
    max: 150,
  },
};

export const validateUserUpdate = validate(updateUserSchema);

/**
 * VALIDATE PAGINATION PARAMETERS
 *
 * Ensures page and limit query parameters are valid
 */
export const validatePagination = (req, res, next) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  const errors = [];

  if (isNaN(page) || page < 1) {
    errors.push('Page must be a positive integer');
  }

  if (isNaN(limit) || limit < 1) {
    errors.push('Limit must be a positive integer');
  }

  if (limit > 100) {
    errors.push('Limit cannot exceed 100');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid pagination parameters',
      errors,
    });
  }

  // Attach validated values to request
  req.pagination = { page, limit };

  next();
};

/**
 * VALIDATE ID PARAMETER
 *
 * Ensures route parameter :id is a valid number
 */
export const validateId = (req, res, next) => {
  const id = req.params.id;

  if (!id || isNaN(id) || Number(id) < 1) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID parameter',
      hint: 'ID must be a positive integer',
    });
  }

  // Attach parsed ID to request
  req.validatedId = Number(id);

  next();
};

/**
 * SANITIZE INPUT
 *
 * Cleans user input to prevent injection attacks
 * This is a basic example - use libraries like DOMPurify for production
 */
export const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Trim whitespace
        req.body[key] = req.body[key].trim();

        // Remove potentially dangerous characters (basic example)
        req.body[key] = req.body[key].replace(/[<>]/g, '');
      }
    }
  }

  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
        req.query[key] = req.query[key].replace(/[<>]/g, '');
      }
    }
  }

  next();
};

/**
 * EXAMPLE: EMAIL VALIDATION
 *
 * Validates email format
 */
export const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
  }

  next();
};
