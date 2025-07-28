const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

exports.showQuiz = async (req, res) => {
  res.render('home.ejs');
};

exports.signup = async (req, res) => {
  res.render('signup.ejs');
};

exports.login = async (req, res) => {
  res.render('login.ejs');
};

exports.support = async (req, res) => {
  res.render('support.ejs');
};

exports.about = async (req, res) => {
  res.render('about.ejs');
};

exports.admin = async (req, res) => {
  res.render('admin.ejs');
};

// --> Function to show the signup form <-- //
exports.showSignupForm = async (req, res) => {
  res.render('signup', { // Predpokladá sa, že 'signup.ejs' je v priečinku 'views'
    title: 'Sign Up',
    errors: [],
    formData: {}
  });
};

// --> Function to register a new user  <-- //
exports.registerUser = async (req, res) => {
  console.log("req.body:", req.body);

  const post = req.body;
  const nickname = post.username;
  const email = post.email;
  const password = post.password;
  const confirmPassword = post.confirm_password;

  // Hash the password
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

// --> Function to show the login form <-- //
exports.showLoginForm = async (req, res) => {
  res.render('login', { // Predpokladá sa, že 'login.ejs' je v priečinku 'views'
    title: 'Login',
    errors: [],
    formData: {}
  });
};

// --> Function to login a user <-- //
exports.login = async (req, res) => {
  console.log('JWT_SECRET ->', JSON.stringify(process.env.JWT_SECRET));

  const username = req.body.username;
  const password = req.body.password;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];
    console.log(user);

    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).send('Invalid username or password');
    }

    // Vytvorenie JWT tokenu
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: 36000 * 24 * 30,
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false, // This set "True" in deployment - it uses only https
      sameSite: 'lax', // Allows navigation → site, blocks CSRF via POST/fetch
      maxAge:  360000 * 24 * 30,
    });

    res.redirect('/');
  }

  catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
};

// --> Function to logout a user <-- //
exports.logout = async (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
  console.log('logout');
};

// --> Function to show the box <-- //
exports.showBox = async (req, res) => {
  console.log("USER FROM JWT:", res.locals.user);

  if (!res.locals.user) {
    return res.redirect('/login');
  }

  res.render('box.ejs', {
    user: res.locals.user
  });
};



