const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/', quizController.showQuiz);
router.get('/signup', quizController.signup); // tu deklaruješ cestu/endpoint + metodu ktoru potom volas v quizController 



module.exports = router;
