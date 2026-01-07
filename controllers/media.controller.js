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

module.exports = {
  postFrame
};

