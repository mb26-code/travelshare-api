const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');


router.get('/photos/:filename', (req, res) => {
  const filepath = path.join(__dirname, '../uploads/photos', req.params.filename);
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});


router.get('/avatars/:filename', (req, res) => {
  const filepath = path.join(__dirname, '../uploads/avatars', req.params.filename);
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

module.exports = router;

