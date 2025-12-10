const Application = require('../models/Application');
const Service = require('../models/Service');
const Form = require('../models/Form');
const mongoose = require('mongoose');

// @desc    Create application
// @route   POST /api/applications
// @access  Private
exports.createApplication = async (req, res) => {
  try {
    const { serviceId, additionalInfo, contactPhone, contactEmail } = req.body;

    console.log('Create application request:', { 
      serviceId, 
      userId: req.user?.id,
      user: req.user,
      body: req.body 
    });

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Validate serviceId
    if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing service ID'
      });
    }

    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Handle file uploads
    const documents = req.files ? req.files.map(file => ({
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`
    })) : [];

    // Create application
    const application = await Application.create({
      user: req.user.id,
      service: serviceId,
      formData: {
        additionalInfo,
        contactPhone,
        contactEmail
      },
      documents,
      statusHistory: [{
        status: 'pending',
        changedBy: req.user.id,
        notes: 'Application submitted'
      }]
    });

    await application.populate('service', 'name category price');

    console.log('Application created:', application._id);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      referenceNumber: application.referenceNumber,
      application
    });
  } catch (error) {
    console.error('Error creating application:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error creating application',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Track application by reference number
// @route   GET /api/applications/track/:referenceNumber
// @access  Private
exports.trackApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      referenceNumber: req.params.referenceNumber
    })
      .populate('service', 'name category price')
      .populate('payment')
      .populate('additionalFormRequests.form')
      .populate('statusHistory.changedBy', 'name');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns this application or is admin
    if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking application',
      error: error.message
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('service')
      .populate('user', 'name email phone')
      .populate('payment')
      .populate('additionalFormRequests.form')
      .populate('adminNotes.addedBy', 'name')
      .populate('statusHistory.changedBy', 'name');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    if (application.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

// @desc    Get current user's applications
// @route   GET /api/applications/my-applications
// @access  Private
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate('service', 'name category price')
      .sort('-createdAt');

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Admin
exports.getAllApplications = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const applications = await Application.find(query)
      .populate('user', 'name email phone')
      .populate('service', 'name category price')
      .populate('payment')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Application.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

// @desc    Update application status (Admin)
// @route   PUT /api/applications/:id/status
// @access  Admin
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      changedBy: req.user.id,
      notes
    });

    if (status === 'completed') {
      application.completedAt = Date.now();
    }

    await application.save();
    await application.populate('user', 'name email');

    res.json({
      success: true,
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message
    });
  }
};

// @desc    Request additional form (Admin)
// @route   POST /api/applications/:id/request-form
// @access  Admin
exports.requestAdditionalForm = async (req, res) => {
  try {
    const { formId } = req.body;

    const application = await Application.findById(req.params.id);
    const form = await Form.findById(formId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    application.additionalFormRequests.push({
      form: formId,
      status: 'pending'
    });

    application.status = 'additional-info-required';
    application.statusHistory.push({
      status: 'additional-info-required',
      changedBy: req.user.id,
      notes: `Additional form requested: ${form.title}`
    });

    await application.save();

    res.json({
      success: true,
      message: 'Additional form requested successfully',
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error requesting additional form',
      error: error.message
    });
  }
};

// @desc    Submit additional form response
// @route   POST /api/applications/:id/additional-form
// @access  Private
exports.submitAdditionalForm = async (req, res) => {
  try {
    const { formRequestId, responseData } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const formRequest = application.additionalFormRequests.id(formRequestId);

    if (!formRequest) {
      return res.status(404).json({
        success: false,
        message: 'Form request not found'
      });
    }

    formRequest.responseData = JSON.parse(responseData || '{}');
    formRequest.submittedAt = Date.now();
    formRequest.status = 'submitted';

    // Check if all additional forms are submitted
    const allSubmitted = application.additionalFormRequests.every(
      req => req.status === 'submitted'
    );

    if (allSubmitted && application.status === 'additional-info-required') {
      application.status = 'in-progress';
      application.statusHistory.push({
        status: 'in-progress',
        changedBy: req.user.id,
        notes: 'All additional information submitted'
      });
    }

    await application.save();

    res.json({
      success: true,
      message: 'Form submitted successfully',
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting form',
      error: error.message
    });
  }
};

// @desc    Add admin note
// @route   POST /api/applications/:id/notes
// @access  Admin
exports.addAdminNote = async (req, res) => {
  try {
    const { note } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.adminNotes.push({
      note,
      addedBy: req.user.id
    });

    await application.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding note',
      error: error.message
    });
  }
};
