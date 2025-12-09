const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide service name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide service description']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Legal Consultation',
      'Company Registration',
      'GST Services',
      'Trademark & IPR',
      'Contract Drafting',
      'Legal Notice',
      'Property Documentation',
      'Tax Advisory',
      'Compliance',
      'Other'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Please provide service price']
  },
  processingTime: {
    type: String,
    default: '7-10 business days'
  },
  requiredDocuments: [{
    type: String
  }],
  formFields: [{
    fieldName: String,
    fieldType: {
      type: String,
      enum: ['text', 'email', 'number', 'textarea', 'file', 'select', 'date'],
      default: 'text'
    },
    label: String,
    required: {
      type: Boolean,
      default: false
    },
    options: [String] // For select fields
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  icon: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
