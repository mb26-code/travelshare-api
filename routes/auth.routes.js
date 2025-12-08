const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');

//POST method on "/api/auth/signup" endpoint
router.post('/signup', authController.signUp);






module.exports = router;