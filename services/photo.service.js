const db = require('../config/db');

const getPhotosByFrameId = async (frameId) => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT id, order_, latitude, longitude, image
       FROM photograph
       WHERE frame_id = ?
       ORDER BY order_ ASC`,
      [frameId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

const getAllPhotos = async () => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT id, frame_id, order_, latitude, longitude, image FROM photograph`
    );
    return rows;
  } finally {
    connection.release();
  }
};

const searchPhotosByLocation = async (lat, lon, radiusKm) => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT id, frame_id, order_, latitude, longitude, image,
        (
          6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + 
            sin(radians(?)) * sin(radians(latitude))
          )
        ) AS distance
       FROM photograph
       HAVING distance < ?
       ORDER BY distance ASC`,
      [lat, lon, lat, radiusKm]
    );
    return rows;
  } finally {
    connection.release();
  }
};

module.exports = {
  getPhotosByFrameId,
  getAllPhotos,
  searchPhotosByLocation
};

