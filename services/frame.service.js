const db = require('../config/db');


const getAllFrames = async (currentUserId = null, limit = 100, query = null) => {
  const connection = await db.getConnection();
  try {
    //we assume currentUserId is 0 or null if user/client is in signed out mode
    let sql = `
      SELECT 
        f.id, f.title, f.description, f.created_at, f.visibility, f.user_group_id, f.size,
        u.id as authorId, u.name_ as authorName, u.profile_picture as authorAvatar,
        (SELECT COUNT(*) FROM like_ WHERE frame_id = f.id) as likeCount,
        (SELECT COUNT(*) FROM like_ WHERE frame_id = f.id AND user_id = ?) as isLiked
      FROM frame f
      JOIN user_ u ON f.user_id = u.id
    `;

    const params = [currentUserId || 0];

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
      ...frame,
      isLiked: !!frame.isLiked, //convert 1/0 to boolean
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

const getFrameById = async (frameId, currentUserId = null) => {
  const connection = await db.getConnection();
  try {
    const [frames] = await connection.query(
      `SELECT 
        f.id, f.title, f.description, f.created_at, f.visibility, f.user_group_id, f.size,
        u.id as authorId, u.name_ as authorName, u.profile_picture as authorAvatar,
        (SELECT COUNT(*) FROM like_ WHERE frame_id = f.id) as likeCount,
        (SELECT COUNT(*) FROM like_ WHERE frame_id = f.id AND user_id = ?) as isLiked
       FROM frame f
       JOIN user_ u ON f.user_id = u.id
       WHERE f.id = ?`,
      [currentUserId || 0, frameId]
    );

    if (frames.length === 0) return null;
    const frame = frames[0];
    frame.isLiked = !!frame.isLiked;

    const [photos] = await connection.query(
      `SELECT id, order_, latitude, longitude, image
       FROM photograph
       WHERE frame_id = ?
       ORDER BY order_ ASC`,
      [frameId]
    );

    return { ...frame, photos };

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



const addLike = async (userId, frameId) => {
  try {
    await db.query('INSERT INTO like_ (user_id, frame_id) VALUES (?, ?)', [userId, frameId]);
    return { message: 'Frame liked' };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw { status: 400, message: 'Frame already liked' };
    }
    throw error;
  }
};

const removeLike = async (userId, frameId) => {
  const [result] = await db.query('DELETE FROM like_ WHERE user_id = ? AND frame_id = ?', [userId, frameId]);
  if (result.affectedRows === 0) {
    throw { status: 400, message: 'Frame was not liked' };
  }
  return { message: 'Frame unliked' };
};

const getFrameLikes = async (frameId) => {
  const [rows] = await db.query('SELECT user_id FROM like_ WHERE frame_id = ?', [frameId]);
  const likers = rows.map(r => r.user_id);
  return { amount: likers.length, likers };
};

module.exports = {
  getAllFrames,
  getFrameById,
  createFrame,
  addLike,
  removeLike,
  getFrameLikes
};

