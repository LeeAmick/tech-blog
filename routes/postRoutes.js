const express = require('express');
const router = express.Router();
const db = require('../routes');

router.get('/post/:id', (req, res) => {
  const postId = req.params.id;
  db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, row) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    if (!row) {
      res.status(404).send('Post not found');
      return;
    }
    db.all('SELECT * FROM comments WHERE post_id = ?', [postId], (err, comments) => {
      if (err) {
        res.status(500).send('Internal Server Error');
        return;
      }
      res.render('post', { post: row, comments });
    });
  });
});

router.post('/post/:id/comment', (req, res) => {
  const { comment } = req.body;
  const postId = req.params.id;
  const userId = req.session.userId;
  db.run('INSERT INTO comments (content, post_id, user_id) VALUES (?, ?, ?)', [comment, postId, userId], (err) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.redirect(`/post/${postId}`);
  });
});

module.exports = router;
