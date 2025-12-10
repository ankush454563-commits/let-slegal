const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create application
router.post('/', protect, upload.array('documents', 10), applicationController.createApplication);

// Get current user's applications
router.get('/my-applications', protect, applicationController.getUserApplications);

// Get application by reference number
router.get('/track/:referenceNumber', protect, applicationController.trackApplication);

// Get single application
router.get('/:id', protect, applicationController.getApplication);

// Submit additional form response
router.post('/:id/additional-form', protect, upload.array('documents', 5), applicationController.submitAdditionalForm);

// Admin routes
router.get('/', protect, authorize('admin'), applicationController.getAllApplications);
router.put('/:id/status', protect, authorize('admin'), applicationController.updateApplicationStatus);
router.post('/:id/request-form', protect, authorize('admin'), applicationController.requestAdditionalForm);
router.post('/:id/notes', protect, authorize('admin'), applicationController.addAdminNote);

module.exports = router;
