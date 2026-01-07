const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media.controller');
const upload = require('../middleware/upload.middleware');
const authenticateToken = require('../middleware/auth.middleware');

router.post('/frames', authenticateToken, upload.array('photos', 10), mediaController.postFrame);

module.exports = router;

