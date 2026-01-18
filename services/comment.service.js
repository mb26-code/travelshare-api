const db = require('../config/db');


const getCommentsByFrame = async (frameId) => {
  const query = `
    SELECT 
      c.id, c.user_id as userId, c.content, c.created_at, c.edited_at,
      u.name_ as authorName, u.profile_picture as authorAvatar
    FROM comment_ c
    JOIN user_ u ON c.user_id = u.id
    WHERE c.frame_id = ?
    ORDER BY c.created_at ASC
  `;
  const [comments] = await db.query(query, [frameId]);
  
  return comments.map(c => ({
    id: c.id,
    userId: c.userId,
    authorName: c.authorName,
    authorAvatar: c.authorAvatar,
    content: c.content,
    postedOn: c.created_at.toISOString().split('T')[0], //YYYY-MM-DD
    postedAt: c.created_at.toISOString().split('T')[1].substring(0, 5), //HH:MM
    edited: c.edited_at !== null
  }));
};


const createComment = async (userId, frameId, content) => {
  const [result] = await db.query(
    'INSERT INTO comment_ (user_id, frame_id, content) VALUES (?, ?, ?)',
    [userId, frameId, content]
  );
  return { id: result.insertId, userId, frameId, content, created_at: new Date() };
};


const getCommentById = async (commentId) => {
  const [rows] = await db.query('SELECT * FROM comment_ WHERE id = ?', [commentId]);
  return rows[0];
};


const updateComment = async (commentId, content) => {
  await db.query(
    'UPDATE comment_ SET content = ?, edited_at = NOW() WHERE id = ?',
    [content, commentId]
  );
  return { message: 'Comment updated' };
};


const deleteComment = async (commentId) => {
  await db.query('DELETE FROM comment_ WHERE id = ?', [commentId]);
  return { message: 'Comment deleted' };
};


const getAllComments = async (limit = 100) => {
  const [rows] = await db.query('SELECT * FROM comment_ ORDER BY created_at DESC LIMIT ?', [parseInt(limit)]);
  return { amount: rows.length, comments: rows };
};

module.exports = {
  getCommentsByFrame,
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
  getAllComments
};

