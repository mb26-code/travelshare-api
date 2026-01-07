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

module.exports = {
  createFrame
};

