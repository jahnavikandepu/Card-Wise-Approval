import { body, validationResult } from 'express-validator';

/**
 * Validation rules for Application creation
 */
export const validateApplication = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full Name is required'),

  body('age')
    .notEmpty()
    .withMessage('Age is required')
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be between 18 and 100'),

  body('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender is required'),

  body('educationLevel')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Education Level cannot be empty'),

  body('education')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Education cannot be empty'),

  body('maritalStatus')
    .trim()
    .notEmpty()
    .withMessage('Marital Status is required'),

  body('dependents')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Dependents must be a non-negative number'),

  body('employmentStatus')
    .trim()
    .notEmpty()
    .withMessage('Employment Status is required'),

  body('employmentYears')
    .notEmpty()
    .withMessage('Employment duration is required')
    .isFloat({ min: 0 })
    .withMessage('Employment duration must be a non-negative number'),

  body('annualIncome')
    .notEmpty()
    .withMessage('Annual Income is required')
    .isFloat({ min: 0 })
    .withMessage('Annual Income must be a non-negative number'),

  body('monthlyExpenses')
    .notEmpty()
    .withMessage('Monthly Expenses is required')
    .isFloat({ min: 0 })
    .withMessage('Monthly Expenses must be a non-negative number'),

  body('existingLoans')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Existing Loans must be a non-negative number'),

  body('creditScore')
    .notEmpty()
    .withMessage('Credit Score is required')
    .isInt({ min: 300, max: 850 })
    .withMessage('Credit Score must be between 300 and 850'),

  body('creditUtilization')
    .notEmpty()
    .withMessage('Credit Utilization is required')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Credit Utilization must be between 0 and 100%'),

  (req, res, next) => {
    // Normalization: Ensure educationLevel is populated from education alias if provided
    if (!req.body.educationLevel && req.body.education) {
      req.body.educationLevel = req.body.education;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array().map((err) => ({
          field: err.path || err.param,
          message: err.msg
        }))
      });
    }
    next();
  }
];
