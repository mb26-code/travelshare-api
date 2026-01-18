const frameService = require('../services/frame.service');
const jwt = require('jsonwebtoken');

const getOptionalUserId = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user.id;
  } catch (e) {
    return null;
  }
};

const getFrames = async (req, res, next) => {
  try {
    const { limit, q } = req.query;
    const userId = getOptionalUserId(req);
    
    const frames = await frameService.getAllFrames(userId, limit || 100, q);
    res.status(200).json(frames);
  } catch (error) {
    next(error);
  }
};

const getFrameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getOptionalUserId(req);

    const frame = await frameService.getFrameById(id, userId);
    
    if (!frame) {
      return res.status(404).json({ error: 'Frame not found.' });
    }
    
    res.status(200).json(frame);
  } catch (error) {
    next(error);
  }
};

const postFrame = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one photo is required' });
    }

    const filenames = req.files.map(file => file.filename);
    
    let photoMetadata = [];
    if (req.body.photoMetadata) {
      try {
        photoMetadata = JSON.parse(req.body.photoMetadata);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid format for photoMetadata (JSON expected)' });
      }
    }

    const cleanData = {
      title: req.body.title || null,
      description: req.body.description || null,
      visibility: req.body.visibility || 'public',
      userGroupId: req.body.userGroupId ? parseInt(req.body.userGroupId) : null
    };

    const result = await frameService.createFrame(req.user.id, cleanData, filenames, photoMetadata);
    res.status(201).json(result);

  } catch (error) {
    next(error);
  }
};



const likeFrame = async (req, res, next) => {
  try {
    await frameService.addLike(req.user.id, req.params.id);
    res.status(200).json({ message: 'Liked' });
  } catch (error) {
    next(error);
  }
};

const unlikeFrame = async (req, res, next) => {
  try {
    await frameService.removeLike(req.user.id, req.params.id);
    res.status(200).json({ message: 'Unliked' });
  } catch (error) {
    next(error);
  }
};

const getFrameLikes = async (req, res, next) => {
  try {
    const result = await frameService.getFrameLikes(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getFrames,
  getFrameById,
  postFrame,
  likeFrame,
  unlikeFrame,
  getFrameLikes
};

