require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

// Create users table if it doesn’t exist
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      // Check if email exists
      const check = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
      if (check.rows.length > 0) {
        const existing = check.rows[0];
        if (existing.email === email) {
          return res.status(400).json({ error: 'Email is already in use.' });
        }
        if (existing.username === username) {
          return res.status(400).json({ error: 'Username is already taken.' });
        }
      }
  
      const hashed = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username, email;',
        [username, email, hashed]
      );
      res.status(201).json({ user: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong on the server.' });
    }
  });

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Incorrect password' });

    res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/', (req, res) => {
    res.send("Hello world!!!!!!");
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));