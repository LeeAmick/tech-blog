const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../routes');

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
      if (err) {
        res.status(500).send('Internal Server Error');
        return;
      }
      res.redirect('/login');
    });
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    if (!row) {
      res.status(400).send('Invalid username or password');
      return;
    }
    bcrypt.compare(password, row.password, (err, result) => {
      if (err) {
        res.status(500).send('Internal Server Error');
        return;
      }
      if (result) {
        req.session.userId = row.id;
        res.redirect('/');
      } else {
        res.status(400).send('Invalid username or password');
      }
    });
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.redirect('/');
  });
});

module.exports = router;
