const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

const { signupValidationRules, validate } = require('../controllers/validators');

// tu deklaruješ cestu/endpoint + metodu ktoru potom volas v quizController 
router.get('/', quizController.showQuiz);
router.get('/signup', quizController.signup); 


module.exports = router;



// GET /signup - Zobrazenie registračného formulára
router.get('/signup', quizController.showSignupForm);

// POST /signup - Spracovanie registrácie
router.post('/signup', signupValidationRules(), validate, quizController.registerUser);

// POST /login - Spracovanie prihlásenia
router.post('/login', quizController.login);
router.get('/login', quizController.showloginForm);

// GET /logout - Spracovanie odhlásenia
router.get('/logout', quizController.logout);
