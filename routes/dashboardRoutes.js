const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/dashboard', (req, res) => {
  const userId = req.session.userId;
  db.all('SELECT * FROM posts WHERE user_id = ?', [userId], (err, rows) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('dashboard', { posts: rows });
  });
});

router.get('/dashboard/new', (req, res) => {
  res.render('new_post');
});

router.post('/dashboard/new', (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.userId;
  db.run('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)', [title, content, userId], (err) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.redirect('/dashboard');
  });
});

router.get('/dashboard/edit/:id', (req, res) => {
  const postId = req.params.id;
  db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, row) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('edit_post', { post: row });
  });
});

router.post('/dashboard/edit/:id', (req, res) => {
  const { title, content } = req.body;
  const postId = req.params.id;
  db.run('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, postId], (err) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.redirect('/dashboard');
  });
});

router.get('/dashboard/delete/:id', (req, res) => {
  const postId = req.params.id;
  db.run('DELETE FROM posts WHERE id = ?', [postId], (err) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.redirect('/dashboard');
  });
});

module.exports = router;
