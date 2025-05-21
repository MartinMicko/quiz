const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

exports.showQuiz = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions');
    res.render('home', { questions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
};

exports.signup = async (req, res) => {
  res.render('signup.ejs');
};

exports.login = async (req, res) => {
  res.render('login.ejs');
};

// backend/controllers/authController.js
const bcrypt = require('bcryptjs');


// Funkcia na zobrazenie registračného formulára
exports.showSignupForm = async (req, res) => {
    res.render('signup', { // Predpokladá sa, že 'signup.ejs' je v priečinku 'views'
        title: 'Sign Up',
        errors: [],
        formData: {}
    });
};

// Funkcia na spracovanie registrácie
exports.registerUser = async (req, res) => {
    // Validácia už prebehla v `validate` middleware
    const { nickname, email, password } = req.body;

    try {
        // Hashovanie hesla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Vytvorenie používateľa v databáze
        const newUser = await userModel.createUser(nickname, email, hashedPassword);

        // Po úspešnej registrácii
        // Môžeš použiť connect-flash pre správy alebo jednoducho presmerovať
        // req.flash('success_msg', 'You are now registered and can log in!');
        res.redirect('/login?registration=success'); // Príklad presmerovania na login

    } catch (error) {
        // Chyby z modelu (napr. duplicitný email/nickname, ak by neboli chytené validatorom)
        // alebo iné neočakávané chyby
        console.error('Error during registration process:', error);
        const errors = [{ msg: error.message || 'An unexpected error occurred. Please try again.' }];
        if (error.status === 409) { // Conflict (duplicitné dáta)
            return res.status(409).render('signup', {
                title: 'Sign Up',
                errors: errors,
                formData: { nickname, email }
            });
        }

        // Všeobecná chyba
        return res.status(500).render('signup', {
            title: 'Sign Up',
            errors: [{ msg: 'Server error during registration. Please try again later.' }],
            formData: { nickname, email }
        });
    }
};

module.exports = {
    showSignupForm,
    registerUser,
};
