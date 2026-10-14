require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const auth = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

app.get('/api/shows', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM shows ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'missing fields' });

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ error: 'email taken' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, hash, name || null]
    );

    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'missing fields' });

  try {
    const [rows] = await db.query('SELECT id, password_hash FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ error: 'invalid credentials' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'invalid credentials' });

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', auth, async (req, res) => {
  const { show_id, seats } = req.body;
  const name = req.body.name || null;
  if (!show_id || !seats) return res.status(400).json({ error: 'missing fields' });

  try {
    const [result] = await db.query(
      'INSERT INTO bookings (show_id, user_id, name, seats) VALUES (?, ?, ?, ?)',
      [show_id, req.user.id, name, seats]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/mybookings', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.id, b.seats, b.created_at, s.title, s.venue, s.time, s.price
       FROM bookings b
       LEFT JOIN shows s ON s.id = b.show_id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function init() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      password_hash VARCHAR(255),
      name VARCHAR(255)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS shows (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      venue VARCHAR(255),
      time DATETIME,
      price DECIMAL(8,2)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      show_id INT,
      user_id INT,
      name VARCHAR(255),
      seats INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [userRows] = await db.query('SELECT COUNT(*) as cnt FROM users WHERE email = ?', ['demo@bmshow.com']);
  if (userRows[0].cnt === 0) {
    const passwordHash = await bcrypt.hash('123456', 10);
    await db.query('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', ['demo@bmshow.com', passwordHash, 'Demo User']);
  }

  const [rows] = await db.query('SELECT COUNT(*) as cnt FROM shows');
  if (rows[0].cnt === 0) {
    await db.query(`INSERT INTO shows (title, venue, time, price) VALUES
      ('Hamlet','Main Theater', NOW(), 12.50),
      ('Improv Night','Studio B', DATE_ADD(NOW(), INTERVAL 1 DAY), 8.00),
      ('Avatar 2','Galaxy Cinema', DATE_ADD(NOW(), INTERVAL 2 DAY), 15.00),
      ('The Dark Knight','Cityplex', DATE_ADD(NOW(), INTERVAL 3 DAY), 18.00),
      ('Spider-Man','Cine World', DATE_ADD(NOW(), INTERVAL 4 DAY), 14.50)
    `);
  } else {
    const defaultMovies = [
      ['Avatar 2', 'Galaxy Cinema', 15.00],
      ['The Dark Knight', 'Cityplex', 18.00],
      ['Spider-Man', 'Cine World', 14.50]
    ];

    for (const [index, [title, venue, price]] of defaultMovies.entries()) {
      const [existing] = await db.query('SELECT id FROM shows WHERE title = ?', [title]);
      if (!existing.length) {
        await db.query(
          'INSERT INTO shows (title, venue, time, price) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY), ?)',
          [title, venue, index + 2, price]
        );
      }
    }
  }
}

init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
