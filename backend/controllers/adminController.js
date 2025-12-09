const User = require('../models/User');
const Application = require('../models/Application');
const Payment = require('../models/Payment');
const Service = require('../models/Service');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments({ role: 'customer' });
    
    // Total applications
    const totalApplications = await Application.countDocuments();
    
    // Applications by status
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const inProgressApplications = await Application.countDocuments({ status: 'in-progress' });
    const completedApplications = await Application.countDocuments({ status: 'completed' });
    const failedApplications = await Application.countDocuments({ status: 'failed' });
    
    // Revenue
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const refundedAmount = await Payment.aggregate([
      { $match: { status: 'refunded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Recent applications
    const recentApplications = await Application.find()
      .populate('user', 'name email')
      .populate('service', 'name category')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Service-wise applications
    const serviceStats = await Application.aggregate([
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      { $unwind: '$serviceDetails' },
      {
        $project: {
          serviceName: '$serviceDetails.name',
          category: '$serviceDetails.category',
          count: 1
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers
        },
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          inProgress: inProgressApplications,
          completed: completedApplications,
          failed: failedApplications
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          refunded: refundedAmount[0]?.total || 0,
          net: (totalRevenue[0]?.total || 0) - (refundedAmount[0]?.total || 0)
        },
        recentApplications,
        popularServices: serviceStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = { role: 'customer' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/status
// @access  Admin
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify admin user status'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// @desc    Get revenue report
// @route   GET /api/admin/revenue
// @access  Admin
exports.getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    let matchStage = { status: 'completed' };
    
    if (startDate && endDate) {
      matchStage.transactionDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let groupFormat;
    switch (groupBy) {
      case 'month':
        groupFormat = { $dateToString: { format: '%Y-%m', date: '$transactionDate' } };
        break;
      case 'year':
        groupFormat = { $dateToString: { format: '%Y', date: '$transactionDate' } };
        break;
      default: // day
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$transactionDate' } };
    }

    const revenue = await Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupFormat,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      revenue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue report',
      error: error.message
    });
  }
};
