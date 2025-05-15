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
