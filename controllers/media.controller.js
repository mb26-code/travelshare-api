const mediaService = require('../services/media.service');

const postFrame = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one photo is required' });
    }

    const filenames = req.files.map(file => file.filename);
    
    const cleanData = {
      title: req.body.title || null,
      description: req.body.description || null,
      visibility: req.body.visibilityType || 'public',
      userGroupId: req.body.userGroupId ? parseInt(req.body.userGroupId) : null,
      latitude: req.body.geolocationLat ? parseFloat(req.body.geolocationLat) : null,
      longitude: req.body.geolocationLon ? parseFloat(req.body.geolocationLon) : null
    };

    const result = await mediaService.createFrame(req.user.id, cleanData, filenames);
    res.status(201).json(result);

  } catch (error) {
    next(error);
  }
};

const getFeed = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const feed = await mediaService.getFeed(limit, offset);
    res.status(200).json(feed);
  } catch (error) {
    next(error);
  }
};

const getFrameDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const frame = await mediaService.getFrameDetails(id);
    
    if (!frame) {
      return res.status(404).json({ error: 'Frame not found' });
    }
    
    res.status(200).json(frame);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postFrame,
  getFeed,
  getFrameDetails
};

