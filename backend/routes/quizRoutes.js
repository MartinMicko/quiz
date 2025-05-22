const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { signupValidationRules, validate } = require('../controllers/validators');

// tu deklaruješ cestu/endpoint + metodu ktoru potom volas v quizController 
router.get('/', quizController.showQuiz);
router.get('/signup', quizController.signup); 
router.get('/login', quizController.login);

router.get('/signup', quizController.showSignupForm);

router.post('/signup', signupValidationRules(), validate, quizController.registerUser);

module.exports = router;