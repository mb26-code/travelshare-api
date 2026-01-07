const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media.controller');
const upload = require('../middleware/upload.middleware');
const authenticateToken = require('../middleware/auth.middleware');

//public routes
router.get('/frames/search', mediaController.search);
router.get('/frames', mediaController.getFeed);
router.get('/frames/:id', mediaController.getFrameDetails);

//authentified routes
router.post('/frames', authenticateToken, upload.array('photos', 10), mediaController.postFrame);

module.exports = router;

