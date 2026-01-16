const frameService = require('../services/frame.service');

const getFrames = async (req, res, next) => {
  try {
    const { limit, q } = req.query;
    const frames = await frameService.getAllFrames(limit || 100, q);
    res.status(200).json(frames);
  } catch (error) {
    next(error);
  }
};

const getFrameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const frame = await frameService.getFrameById(id);
    
    if (!frame) {
      return res.status(404).json({ error: 'Frame not found' });
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

module.exports = {
  getFrames,
  getFrameById,
  postFrame
};

