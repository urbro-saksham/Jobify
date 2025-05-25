const { body, validationResult } = require('express-validator');

const validateUserRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password')
  .isLength({ min: 6 })
  .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
  .matches(/[0-9]/).withMessage('Password must contain a number')
  .withMessage('Password must be at least 6 characters long'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('title').notEmpty().withMessage('Title is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateUserLogin = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]

const validateRecruiterRegister = [
  body('name.firstname').notEmpty().withMessage('First name is required'),
  body('name.lastname').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 6 })
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .withMessage('Password must be at least 6 characters long'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('companyname').notEmpty().withMessage('Company name is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 

const validateRecruiterLogin = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateUserRegister, validateUserLogin, validateRecruiterRegister, validateRecruiterLogin };