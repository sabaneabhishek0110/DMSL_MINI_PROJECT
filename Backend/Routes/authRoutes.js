const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const { authenticate } = require('../Middlewares/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;