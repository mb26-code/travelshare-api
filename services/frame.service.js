const db = require('../config/db');

const getAllFrames = async (limit = 20, query = null) => {
  const connection = await db.getConnection();
  try {
    let sql = `
      SELECT 
        f.id, f.title, f.description, f.created_at, f.visibility, f.user_group_id, f.size,
        u.id as authorId, u.name_ as authorName, u.profile_picture as authorAvatar
      FROM frame f
      JOIN user_ u ON f.user_id = u.id
    `;

    const params = [];

    if (query) {
      sql += ` WHERE f.title LIKE ? OR f.description LIKE ?`;
      params.push(`%${query}%`, `%${query}%`);
    }

    sql += ` ORDER BY f.created_at DESC LIMIT ?`;
    params.push(parseInt(limit));

    const [frames] = await connection.query(sql, params);

    if (frames.length === 0) return [];

    const frameIds = frames.map(f => f.id);
    const [photos] = await connection.query(
      `SELECT id, frame_id, order_, latitude, longitude, image 
       FROM photograph 
       WHERE frame_id IN (?) 
       ORDER BY order_ ASC`,
      [frameIds]
    );

    return frames.map(frame => ({
      id: frame.id,
      title: frame.title,
      description: frame.description,
      created_at: frame.created_at,
      visibility: frame.visibility,
      userGroupId: frame.user_group_id,
      authorId: frame.authorId,
      authorName: frame.authorName,
      authorAvatar: frame.authorAvatar,
      size: frame.size,
      photos: photos
        .filter(p => p.frame_id === frame.id)
        .map(p => ({
          id: p.id,
          order_: p.order_,
          latitude: p.latitude,
          longitude: p.longitude,
          image: p.image
        }))
    }));

  } finally {
    connection.release();
  }
};

const getFrameById = async (frameId) => {
  const connection = await db.getConnection();
  try {
    const [frames] = await connection.query(
      `SELECT 
        f.id, f.title, f.description, f.created_at, f.visibility, f.user_group_id, f.size,
        u.id as authorId, u.name_ as authorName, u.profile_picture as authorAvatar
       FROM frame f
       JOIN user_ u ON f.user_id = u.id
       WHERE f.id = ?`,
      [frameId]
    );

    if (frames.length === 0) return null;
    const frame = frames[0];

    const [photos] = await connection.query(
      `SELECT id, order_, latitude, longitude, image
       FROM photograph
       WHERE frame_id = ?
       ORDER BY order_ ASC`,
      [frameId]
    );

    return {
      id: frame.id,
      title: frame.title,
      description: frame.description,
      created_at: frame.created_at,
      visibility: frame.visibility,
      userGroupId: frame.user_group_id,
      authorId: frame.authorId,
      authorName: frame.authorName,
      authorAvatar: frame.authorAvatar,
      size: frame.size,
      photos: photos
    };

  } finally {
    connection.release();
  }
};

const createFrame = async (userId, data, filenames, photoMetadata) => {
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
      const photoValues = filenames.map((filename, index) => {
        const meta = photoMetadata[index] || {};
        return [
          frameId,
          index,
          filename,
          meta.latitude || null,
          meta.longitude || null
        ];
      });

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

module.exports = {
  getAllFrames,
  getFrameById,
  createFrame
};

