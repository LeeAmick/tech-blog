const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/', (req, res) => {
  db.all('SELECT * FROM posts', (err, rows) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('home', { posts: rows });
  });
});

module.exports = router;
