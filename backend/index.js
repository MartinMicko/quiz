const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const quizRoutes = require('./routes/quizRoutes');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

// PostgreSQL pool config
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Set EJS as the view engine and set views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pre parsovanie tela požiadavky
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// Use routes
app.use('/', quizRoutes);
// Route: home page renders quiz questions from DB

// Spracovanie chýb (jednoduchý príklad)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', { // Predpokladá sa, že máš error.ejs
        title: 'Error',
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
