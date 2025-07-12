const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config(); // Load env variables

const app = express();
const port = process.env.PORT || 4000;

// Middleware: parse cookies
app.use(cookieParser());

// Middleware: parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: custom JWT checker
const checkAuth = require('./middleware/auth');
app.use(checkAuth);

// Set EJS as the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL pool config
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Attach pool to req if needed in routes (optional)
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Routes
const quizRoutes = require('./routes/quizRoutes');
app.use('/', quizRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('error', {
    title: 'Error',
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
