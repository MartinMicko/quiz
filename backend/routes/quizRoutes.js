const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/', quizController.showQuiz);
router.get('/signup', quizController.signup); // tu deklaruješ cestu/endpoint + metodu ktoru potom volas v quizController 



// Signup page
router.get('/signup', (req, res) => {
  res.render('signup');
});

// Home page
router.get('/', (req, res) => {
  res.render('home');
});

module.exports = router;
