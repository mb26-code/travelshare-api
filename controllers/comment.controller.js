const commentService = require('../services/comment.service');

const getFrameComments = async (req, res, next) => {
  try {
    const { id } = req.params; //frameId
    const comments = await commentService.getCommentsByFrame(id);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

const postComment = async (req, res, next) => {
  try {
    const { id } = req.params; //frameId
    const { content } = req.body;
    
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const result = await commentService.createComment(req.user.id, id, content);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params; //commentId
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await commentService.getCommentById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.user_id !== userId) return res.status(403).json({ error: 'Unauthorized' });

    await commentService.updateComment(id, content);
    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params; //commentId
    const userId = req.user.id;

    const comment = await commentService.getCommentById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.user_id !== userId) return res.status(403).json({ error: 'Unauthorized' });

    await commentService.deleteComment(id);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};


const getAllComments = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const result = await commentService.getAllComments(limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getCommentById = async (req, res, next) => {
  try {
    const comment = await commentService.getCommentById(req.params.id);
    if(!comment) return res.status(404).json({error: "Comment not found"});
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFrameComments,
  postComment,
  updateComment,
  deleteComment,
  getAllComments,
  getCommentById
};

