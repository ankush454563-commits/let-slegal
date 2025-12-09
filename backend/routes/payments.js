const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Create order
router.post('/create-order', protect, paymentController.createOrder);

// Verify payment
router.post('/verify', protect, paymentController.verifyPayment);

// Initiate refund (Admin only)
router.post('/refund/:paymentId', protect, authorize('admin'), paymentController.initiateRefund);

// Get payment details
router.get('/:paymentId', protect, paymentController.getPaymentDetails);

module.exports = router;
