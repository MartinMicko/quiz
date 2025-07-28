const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const apiController = require('../controllers/apiController');
const { signupValidationRules, loginValidationRules, validate } = require('../controllers/validators');
const redirectIfLoggedIn = require('../middleware/redirectIfLoggedIn');

// tu deklaruješ cestu/endpoint + metodu ktoru potom volas v quizController 
router.get('/', quizController.showQuiz);

router.get('/support', quizController.support);

router.get('/about', quizController.about);

router.get('/admin', quizController.admin);

router.get('/signup', redirectIfLoggedIn, quizController.showSignupForm);

router.get('/login', redirectIfLoggedIn, quizController.showLoginForm);

router.get('/logout', quizController.logout);

router.get('/box', quizController.showBox);

router.post('/signup', redirectIfLoggedIn, signupValidationRules(), validate, quizController.registerUser);

router.post('/login', loginValidationRules(), validate, quizController.login);

module.exports = router;
