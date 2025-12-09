const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { protect, authorize } = require('../middleware/auth');

// Admin routes
router.post('/', protect, authorize('admin'), formController.createForm);
router.get('/', protect, authorize('admin'), formController.getAllForms);
router.get('/:id', protect, formController.getFormById);
router.put('/:id', protect, authorize('admin'), formController.updateForm);
router.delete('/:id', protect, authorize('admin'), formController.deleteForm);

module.exports = router;
