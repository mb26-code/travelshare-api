const express = require('express');
const router = express.Router();
const frameController = require('../controllers/frame.controller');
const photoController = require('../controllers/photo.controller');
const commentController = require('../controllers/comment.controller');
const upload = require('../middleware/upload.middleware');
const authenticateToken = require('../middleware/auth.middleware');


router.get('/', frameController.getFrames);
router.get('/:id', frameController.getFrameById);
router.get('/:id/photos', photoController.getFramePhotos);
router.post('/', authenticateToken, upload.array('photos', 10), frameController.postFrame);

//likes
router.post('/:id/likes', authenticateToken, frameController.likeFrame);
router.delete('/:id/likes', authenticateToken, frameController.unlikeFrame);
router.get('/:id/likes', frameController.getFrameLikes);

//comments
router.get('/:id/comments', commentController.getFrameComments);
router.post('/:id/comments', authenticateToken, commentController.postComment);

module.exports = router;

