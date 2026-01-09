const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * tags:
 * name: Auth
 * description: Authentification et gestion des utilisateurs
 */

/**
 * @swagger
 * /auth/register:
 * post:
 * summary: Créer un compte utilisateur
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - username
 * - email
 * - password
 * properties:
 * username:
 * type: string
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 * format: password
 * responses:
 * 201:
 * description: Utilisateur créé avec succès
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * 400:
 * description: Données invalides
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error'
 */
router.post('/register', authLimiter, authController.register);

/**
 * @swagger
 * /auth/login:
 * post:
 * summary: Connexion utilisateur
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 * format: password
 * responses:
 * 200:
 * description: Connexion réussie
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse'
 * 401:
 * description: Identifiants invalides
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error'
 */
router.post('/login', authLimiter, authController.login);

module.exports = router;

