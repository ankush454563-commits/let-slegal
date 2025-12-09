const crypto = require('crypto');
const Payment = require('../models/Payment');
const Application = require('../models/Application');

// Initialize Razorpay (optional - only if credentials are provided)
let razorpay = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    const Razorpay = require('razorpay');
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
} catch (error) {
  console.log('Razorpay not configured, payment simulation mode enabled');
}

// @desc    Create payment order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { applicationId, amount } = req.body;

    // Verify application
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns the application
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${applicationId}`,
      notes: {
        applicationId: applicationId,
        userId: req.user.id
      }
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    const payment = await Payment.create({
      application: applicationId,
      user: req.user.id,
      amount,
      razorpayOrderId: order.id,
      status: 'pending'
    });

    res.json({
      success: true,
      order,
      paymentId: payment._id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message
    });
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (isValid) {
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      payment.status = 'completed';
      await payment.save();

      // Update application payment status
      const application = await Application.findById(payment.application);
      application.payment = payment._id;
      application.paymentStatus = 'completed';
      application.status = 'in-progress';
      application.statusHistory.push({
        status: 'in-progress',
        changedBy: req.user.id,
        notes: 'Payment completed successfully'
      });
      await application.save();

      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment,
        application
      });
    } else {
      payment.status = 'failed';
      await payment.save();

      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// @desc    Initiate refund
// @route   POST /api/payments/refund/:paymentId
// @access  Admin
exports.initiateRefund = async (req, res) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot refund payment that is not completed'
      });
    }

    // Create refund with Razorpay
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: payment.amount * 100,
      notes: { reason }
    });

    payment.status = 'refunded';
    payment.refund = {
      refundId: refund.id,
      refundAmount: payment.amount,
      refundedAt: Date.now(),
      reason
    };
    await payment.save();

    // Update application
    const application = await Application.findById(payment.application);
    application.paymentStatus = 'refunded';
    application.status = 'failed';
    application.statusHistory.push({
      status: 'failed',
      changedBy: req.user.id,
      notes: `Refund initiated: ${reason}`
    });
    await application.save();

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error initiating refund',
      error: error.message
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:paymentId
// @access  Private
exports.getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('application')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check authorization
    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment details',
      error: error.message
    });
  }
};
