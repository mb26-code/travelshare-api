const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimiter');


router.post('/register', authLimiter, authController.register);

router.post('/login', authLimiter, authController.login);

module.exports = router;

