const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

const { signupValidationRules, validate } = require('../controllers/validators');

// tu deklaruješ cestu/endpoint + metodu ktoru potom volas v quizController 
router.get('/', quizController.showQuiz);
router.get('/signup', quizController.signup); 
router.get('/login', quizController.login);

module.exports = router;



// GET /signup - Zobrazenie registračného formulára
router.get('/signup', quizController.showSignupForm);

// POST /signup - Spracovanie registrácie
router.post('/signup', signupValidationRules(), validate, quizController.registerUser);

// GET /login (len ako príklad pre presmerovanie)
router.get('/login', (req, res) => {
    // Tu by si renderoval login stránku
    // Prípadne spracoval query parameter 'registration=success' na zobrazenie správy
    const messages = [];
    if (req.query.registration === 'success') {
        messages.push({ type: 'success', text: 'Registration successful! You can now log in.' });
    }
    res.render('login', { title: 'Login', messages }); // Predpokladá sa, že máš login.ejs
});