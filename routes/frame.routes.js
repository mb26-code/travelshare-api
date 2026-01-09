const express = require('express');
const router = express.Router();
const frameController = require('../controllers/frame.controller');
const photoController = require('../controllers/photo.controller');
const upload = require('../middleware/upload.middleware');
const authenticateToken = require('../middleware/auth.middleware');


/**
 * @swagger
 * tags:
 * name: Frames
 * description: Gestion des publications (Frames)
 */

/**
 * @swagger
 * /frames:
 * get:
 * summary: Récupérer la liste des frames (toutes ou filtrées)
 * tags: [Frames]
 * parameters:
 * - in: query
 * name: limit
 * schema:
 * type: integer
 * default: 20
 * description: Nombre maximum de frames à retourner
 * - in: query
 * name: q
 * schema:
 * type: string
 * description: Recherche textuelle (titre ou description)
 * responses:
 * 200:
 * description: Liste des frames récupérée avec succès
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * title:
 * type: string
 * description:
 * type: string
 * created_at:
 * type: string
 * format: date-time
 * visibility:
 * type: string
 * enum: [public, user_group, private]
 * userGroupId:
 * type: integer
 * nullable: true
 * authorId:
 * type: integer
 * authorName:
 * type: string
 * authorAvatar:
 * type: string
 * nullable: true
 * size:
 * type: integer
 * photos:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * order_:
 * type: integer
 * latitude:
 * type: number
 * longitude:
 * type: number
 * image:
 * type: string
 */
router.get('/', frameController.getFrames);

/**
 * @swagger
 * /frames/{id}:
 * get:
 * summary: Récupérer les détails d'une frame spécifique
 * tags: [Frames]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID de la frame
 * responses:
 * 200:
 * description: Détails de la frame
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * id:
 * type: integer
 * title:
 * type: string
 * description:
 * type: string
 * created_at:
 * type: string
 * format: date-time
 * visibility:
 * type: string
 * userGroupId:
 * type: integer
 * authorId:
 * type: integer
 * authorName:
 * type: string
 * authorAvatar:
 * type: string
 * size:
 * type: integer
 * photos:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * order_:
 * type: integer
 * latitude:
 * type: number
 * longitude:
 * type: number
 * image:
 * type: string
 * 404:
 * description: Frame introuvable
 */
router.get('/:id', frameController.getFrameById);

/**
 * @swagger
 * /frames/{id}/photos:
 * get:
 * summary: Récupérer uniquement les photos d'une frame
 * tags: [Frames]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID de la frame
 * responses:
 * 200:
 * description: Liste des photos de la frame
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * image:
 * type: string
 * latitude:
 * type: number
 * longitude:
 * type: number
 * order_:
 * type: integer
 */
router.get('/:id/photos', photoController.getFramePhotos);

/**
 * @swagger
 * /frames:
 * post:
 * summary: Créer une nouvelle frame (avec photos)
 * tags: [Frames]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * required:
 * - photos
 * properties:
 * title:
 * type: string
 * description:
 * type: string
 * visibility:
 * type: string
 * enum: [public, user_group, private]
 * default: public
 * userGroupId:
 * type: integer
 * photoMetadata:
 * type: string
 * description: "String JSON représentant un tableau d'objets pour la géolocalisation de chaque photo (ex: `[{latitude: 10, longitude: 20}, {latitude: 11, longitude: 21}]`)"
 * photos:
 * type: array
 * items:
 * type: string
 * format: binary
 * responses:
 * 201:
 * description: Frame créée avec succès
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * frameId:
 * type: integer
 * message:
 * type: string
 * 400:
 * description: Données invalides ou photo manquante
 * 401:
 * description: Non autorisé (Token manquant ou invalide)
 */
router.post('/', authenticateToken, upload.array('photos', 10), frameController.postFrame);


module.exports = router;

