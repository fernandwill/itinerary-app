const { body, param, validationResult } = require('express-validator');

// Validation rules for creating itinerary
const validateCreateItinerary = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters')
    .escape(),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters')
    .escape(),
  
  body('destination')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Destination must be between 1 and 255 characters')
    .escape(),
  
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),
  
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date (YYYY-MM-DD)')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number')
    .toFloat(),
  
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code (e.g., USD)')
    .isUppercase()
    .withMessage('Currency must be uppercase')
    .matches(/^[A-Z]{3}$/)
    .withMessage('Currency must be a valid 3-letter code'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value')
    .toBoolean()
];

// Validation rules for updating itinerary
const validateUpdateItinerary = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters')
    .escape(),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters')
    .escape(),
  
  body('destination')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Destination must be between 1 and 255 characters')
    .escape(),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date (YYYY-MM-DD)'),
  
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (value && req.body.startDate) {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);
        
        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    }),
  
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number')
    .toFloat(),
  
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code (e.g., USD)')
    .isUppercase()
    .withMessage('Currency must be uppercase')
    .matches(/^[A-Z]{3}$/)
    .withMessage('Currency must be a valid 3-letter code'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value')
    .toBoolean()
];

// Validation for UUID parameters
const validateItineraryId = [
  param('id')
    .isUUID()
    .withMessage('Invalid itinerary ID format')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      }
    });
  }
  
  next();
};

module.exports = {
  validateCreateItinerary,
  validateUpdateItinerary,
  validateItineraryId,
  handleValidationErrors
};