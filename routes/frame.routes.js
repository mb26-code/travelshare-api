const express = require('express');
const router = express.Router();
const frameController = require('../controllers/frame.controller');
const photoController = require('../controllers/photo.controller');
const upload = require('../middleware/upload.middleware');
const authenticateToken = require('../middleware/auth.middleware');


router.get('/', frameController.getFrames);

router.get('/:id', frameController.getFrameById);

router.get('/:id/photos', photoController.getFramePhotos);

router.post('/', authenticateToken, upload.array('photos', 10), frameController.postFrame);

module.exports = router;

