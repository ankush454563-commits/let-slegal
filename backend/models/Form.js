const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  fields: [{
    fieldName: {
      type: String,
      required: true
    },
    fieldType: {
      type: String,
      enum: ['text', 'email', 'number', 'textarea', 'file', 'select', 'radio', 'checkbox', 'date'],
      default: 'text',
      required: true
    },
    label: {
      type: String,
      required: true
    },
    placeholder: String,
    required: {
      type: Boolean,
      default: false
    },
    options: [String], // For select, radio, checkbox
    validation: {
      pattern: String,
      minLength: Number,
      maxLength: Number,
      min: Number,
      max: Number
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Form', formSchema);
