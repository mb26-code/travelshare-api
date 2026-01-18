const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter');

//public routes
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);

//password reset routes (No JWT required)
router.post('/password-reset', authLimiter, authController.requestPasswordReset);
router.post('/password-reset/confirm', authLimiter, authController.confirmPasswordReset);

//protected routes (require valid JWT)
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;

