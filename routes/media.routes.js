const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media.controller');
const upload = require('../middleware/upload.middleware');
const authenticateToken = require('../middleware/auth.middleware');


/**
 * @swagger
 * tags:
 *   name: Frames
 *   description: Consultation et publication de frames
 */

//public routes

/**
 * @swagger
 * /frames/search:
 *   get:
 *     summary: Recherche de frames
 *     tags: [Frames]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Terme de recherche
 *     responses:
 *       200:
 *         description: Résultats de recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Frame'
 */
router.get('/frames/search', mediaController.search);


/**
 * @swagger
 * /frames:
 *   get:
 *     summary: Récupère le feed public
 *     tags: [Frames]
 *     responses:
 *       200:
 *         description: Liste de frames
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Frame'
 */
router.get('/frames', mediaController.getFeed);



/**
 * @swagger
 * /frames/{id}:
 *   get:
 *     summary: Détails d'une frame
 *     tags: [Frames]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la frame
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Frame'
 *       404:
 *         description: Frame introuvable
 */
router.get('/frames/:id', mediaController.getFrameDetails);

//authentified routes



/**
 * @swagger
 * /frames:
 *   post:
 *     summary: Publier une frame (auth requis)
 *     tags: [Frames]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - photos
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Frame créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Frame'
 *       401:
 *         description: Token manquant ou invalide
 */
router.post('/frames', authenticateToken, upload.array('photos', 10), mediaController.postFrame);



module.exports = router;

