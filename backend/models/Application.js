const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  referenceNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  formData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  documents: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'additional-info-required', 'completed', 'failed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded', 'failed'],
    default: 'pending'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  additionalFormRequests: [{
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    submittedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'submitted'],
      default: 'pending'
    },
    responseData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  }],
  adminNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate reference number
applicationSchema.pre('save', async function(next) {
  if (!this.referenceNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.referenceNumber = `LL${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
