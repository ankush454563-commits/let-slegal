const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Get user profile
router.get('/profile', protect, userController.getProfile);

// Update user profile
router.put('/profile', protect, userController.updateProfile);

// Get user applications
router.get('/applications', protect, userController.getUserApplications);

module.exports = router;
