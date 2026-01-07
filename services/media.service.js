const db = require('../config/db');

const createFrame = async (userId, data, filenames) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const [frameResult] = await connection.query(
      `INSERT INTO frame (user_id, title, description, visibility, user_group_id, size) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.title || null,
        data.description || null,
        data.visibility,
        data.userGroupId,
        filenames.length
      ]
    );

    const frameId = frameResult.insertId;

    if (filenames.length > 0) {
      const photoValues = filenames.map((filename, index) => [
        frameId,
        index,
        filename,
        data.latitude,
        data.longitude
      ]);

      await connection.query(
        'INSERT INTO photograph (frame_id, order_, image, latitude, longitude) VALUES ?',
        [photoValues]
      );
    }

    await connection.commit();
    return { frameId, message: 'Frame created successfully' };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getFeed = async (limit = 20, offset = 0) => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 
        f.id, f.title, f.description, f.created_at, f.size, 
        u.id as authorId, u.name_ as authorName, u.profile_picture as authorAvatar,
        p.image as coverImage, p.latitude, p.longitude
       FROM frame f
       JOIN user_ u ON f.user_id = u.id
       LEFT JOIN photograph p ON f.id = p.frame_id AND p.order_ = 0
       WHERE f.visibility = 'public'
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );
    return rows;
  } finally {
    connection.release();
  }
};

const getFrameDetails = async (frameId) => {
  const connection = await db.getConnection();
  try {
    const [frames] = await connection.query(
      `SELECT 
        f.id, f.title, f.description, f.created_at, f.visibility,
        u.id as authorId, u.name_ as authorName, u.profile_picture as authorAvatar
       FROM frame f
       JOIN user_ u ON f.user_id = u.id
       WHERE f.id = ?`,
      [frameId]
    );

    if (frames.length === 0) return null;

    const [photos] = await connection.query(
      `SELECT id, image, order_, latitude, longitude
       FROM photograph
       WHERE frame_id = ?
       ORDER BY order_ ASC`,
      [frameId]
    );

    return { ...frames[0], photos };
  } finally {
    connection.release();
  }
};

module.exports = {
  createFrame,
  getFeed,
  getFrameDetails
};

