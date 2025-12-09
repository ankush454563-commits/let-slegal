const Form = require('../models/Form');

// @desc    Create form
// @route   POST /api/forms
// @access  Admin
exports.createForm = async (req, res) => {
  try {
    const form = await Form.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Form created successfully',
      form
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating form',
      error: error.message
    });
  }
};

// @desc    Get all forms
// @route   GET /api/forms
// @access  Admin
exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: forms.length,
      forms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message
    });
  }
};

// @desc    Get form by ID
// @route   GET /api/forms/:id
// @access  Private
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    res.json({
      success: true,
      form
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching form',
      error: error.message
    });
  }
};

// @desc    Update form
// @route   PUT /api/forms/:id
// @access  Admin
exports.updateForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    res.json({
      success: true,
      message: 'Form updated successfully',
      form
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating form',
      error: error.message
    });
  }
};

// @desc    Delete form
// @route   DELETE /api/forms/:id
// @access  Admin
exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    res.json({
      success: true,
      message: 'Form deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting form',
      error: error.message
    });
  }
};
