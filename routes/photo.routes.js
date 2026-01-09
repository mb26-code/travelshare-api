const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo.controller');

/**
 * @swagger
 * tags:
 * name: Photos
 * description: Recherche et gestion des photos individuelles
 */

/**
 * @swagger
 * /photos:
 * get:
 * summary: Récupérer des photos (Global ou par localisation)
 * description: Renvoie toutes les photos si aucun paramètre n'est fourni, ou filtre par proximité si latitude/longitude sont fournis.
 * tags: [Photos]
 * parameters:
 * - in: query
 * name: latitude
 * schema:
 * type: number
 * description: Latitude du centre de recherche (optionnel)
 * - in: query
 * name: longitude
 * schema:
 * type: number
 * description: Longitude du centre de recherche (optionnel)
 * - in: query
 * name: radiusKm
 * schema:
 * type: number
 * default: 10
 * description: Rayon de recherche en kilomètres (optionnel, défaut 10km)
 * responses:
 * 200:
 * description: Liste des photos trouvées
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * frame_id:
 * type: integer
 * image:
 * type: string
 * latitude:
 * type: number
 * longitude:
 * type: number
 * distance:
 * type: number
 * description: Distance en km du point de recherche (uniquement si recherche géo)
 */
router.get('/', photoController.getPhotos);

module.exports = router;

