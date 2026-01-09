const photoService = require('../services/photo.service');

const getPhotos = async (req, res, next) => {
  try {
    const { latitude, longitude, radiusKm } = req.query;

    if (latitude && longitude) {
      const results = await photoService.searchPhotosByLocation(
        parseFloat(latitude), 
        parseFloat(longitude), 
        
        radiusKm ? parseFloat(radiusKm) : 10
      );
      return res.status(200).json(results);
    }

    const photos = await photoService.getAllPhotos();
    res.status(200).json(photos);

  } catch (error) {
    next(error);
  }
};

const getFramePhotos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const photos = await photoService.getPhotosByFrameId(id);
    res.status(200).json(photos);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPhotos,
  getFramePhotos
};

