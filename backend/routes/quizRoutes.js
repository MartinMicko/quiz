const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/', quizController.showQuiz);
router.get('/signup', quizController.signup);



module.exports = router;
