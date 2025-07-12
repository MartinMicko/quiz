const { body, validationResult } = require('express-validator');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

const signupValidationRules = () => {
    return [
        body('username')
            .trim()
            .notEmpty().withMessage('Nickname is required.')
            .isLength({ min: 3, max: 30 }).withMessage('Nickname must be between 3 and 30 characters.')
            .matches(/^[a-zA-Z0-9_]+$/).withMessage('Nickname can only contain letters, numbers, and underscores.')
            .custom(async (value) => {
                const res = await pool.query('SELECT 1 FROM users WHERE username = $1', [value]);
                if (res.rowCount > 0) {
                    return Promise.reject('Nickname is already taken.');
                }
            }),
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required.')
            .isEmail().withMessage('Please enter a valid email address.')
            .normalizeEmail()
            .custom(async (value) => {
                const res = await pool.query('SELECT 1 FROM users WHERE email = $1', [value]);
                if (res.rowCount > 0) {
                    return Promise.reject('Email address is already in use.');
                }
            }),
        body('password')
            .notEmpty().withMessage('Password is required.')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
        body('confirm_password')
            .notEmpty().withMessage('Password confirmation is required.')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match.');
                }
                return true;
            }),
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = errors.array().map(err => ({ msg: err.msg, param: err.param }));

    return res.status(422).render('signup', {
        title: 'Sign Up',
        errors: extractedErrors,
        formData: {
            nickname: req.body.nickname,
            email: req.body.email,
        }
    });
};

module.exports = {
    signupValidationRules,
    validate,
    pool
};
