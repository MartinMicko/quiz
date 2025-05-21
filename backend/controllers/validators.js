
const { body, validationResult } = require('express-validator');


const signupValidationRules = () => {
    return [
        body('nickname')
            .trim()
            .notEmpty().withMessage('Nickname is required.')
            .isLength({ min: 3, max: 30 }).withMessage('Nickname must be between 3 and 30 characters.')
            .matches(/^[a-zA-Z0-9_]+$/).withMessage('Nickname can only contain letters, numbers, and underscores.')
            .custom(async (value) => {
                const user = await userModel.findUserByNickname(value);
                if (user) {
                    return Promise.reject('Nickname is already taken.');
                }
            }),
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required.')
            .isEmail().withMessage('Please enter a valid email address.')
            .normalizeEmail()
            .custom(async (value) => {
                const user = await userModel.findUserByEmail(value);
                if (user) {
                    return Promise.reject('Email address is already in use.');
                }
            }),
        body('password')
            .notEmpty().withMessage('Password is required.')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
            // Môžeš pridať ďalšie pravidlá pre silu hesla (veľké písmeno, číslo, špeciálny znak)
            // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            // .withMessage('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'),
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

    // Ak máš EJS view pre signup
    return res.status(422).render('signup', { // Uisti sa, že 'signup' je názov tvojho EJS súboru
        title: 'Sign Up',
        errors: extractedErrors,
        formData: { // Pošli späť dáta, aby ich používateľ nemusel znova vypĺňať (okrem hesiel)
            nickname: req.body.nickname,
            email: req.body.email,
        }
    });
    // Ak posielaš JSON odpoveď pre API
    // return res.status(422).json({ errors: extractedErrors });
};

module.exports = {
    signupValidationRules,
    validate,
};