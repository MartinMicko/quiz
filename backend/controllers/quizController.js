const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

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

// Funkcia na zobrazenie registračného formulára
exports.showSignupForm = async (req, res) => {
    res.render('signup', {
        title: 'Sign Up',
        errors: [],
        formData: {}
    });
};


exports.registerUser = async (req, res) => {
    console.log("req.body:", req.body);

    const post = req.body;
    const nickname = post.username;
    const email = post.email;
    const password = post.password;
    const confirmPassword = post.confirm_password;

    

    // Hashovanie hesla
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const result = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [nickname, email, hashedPassword]
      );
      
    
      console.log('User registered:', result.rows[0]);
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.status(500).send('Database error');
    }
  };


