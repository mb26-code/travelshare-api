const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authenticateToken = require('../middleware/auth.middleware');

//fetch all comments
router.get('/', commentController.getAllComments);

router.get('/:id', commentController.getCommentById);
router.patch('/:id', authenticateToken, commentController.updateComment);
router.delete('/:id', authenticateToken, commentController.deleteComment);

module.exports = router;

