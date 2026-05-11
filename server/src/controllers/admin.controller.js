import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import SupportTicket from '../models/SupportTicket.js';
import AppError from '../middleware/errorHandler.js';

// Get Dashboard Stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await Vendor.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('buyer');

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalVendors,
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get All Users
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, status } = req.query;

    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get User by ID
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password -refreshToken');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Suspend User
export const suspendUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        status: 'suspended',
        suspendedReason: reason,
        suspendedAt: new Date()
      },
      { new: true }
    ).select('-password -refreshToken');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'User suspended',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Reactivate User
export const reactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        status: 'active',
        suspendedReason: null,
        suspendedAt: null
      },
      { new: true }
    ).select('-password -refreshToken');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'User reactivated',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Get All Vendors
export const getAllVendors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, verified } = req.query;

    const query = {};
    if (verified !== undefined) query.isVerified = verified === 'true';

    const vendors = await Vendor.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Vendor.countDocuments(query);

    res.json({
      success: true,
      data: vendors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Approve Vendor
export const approveVendor = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        isVerified: true,
        verification: {
          status: 'approved',
          approvedAt: new Date(),
          approvedBy: req.user._id
        }
      },
      { new: true }
    );

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    res.json({
      success: true,
      message: 'Vendor approved',
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// Reject Vendor
export const rejectVendor = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        isVerified: false,
        verification: {
          status: 'rejected',
          reason,
          rejectedAt: new Date(),
          rejectedBy: req.user._id
        }
      },
      { new: true }
    );

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    res.json({
      success: true,
      message: 'Vendor rejected',
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// Suspend Vendor
export const suspendVendor = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        status: 'suspended',
        suspensionReason: reason,
        suspendedAt: new Date()
      },
      { new: true }
    );

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    res.json({
      success: true,
      message: 'Vendor suspended',
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// Get All Products
export const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const products = await Product.find(query)
      .populate('vendor')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Approve Product
export const approveProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndUpdate(
      productId,
      { status: 'active' },
      { new: true }
    ).populate('vendor');

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json({
      success: true,
      message: 'Product approved',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Reject Product
export const rejectProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { reason } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        status: 'rejected',
        rejectionReason: reason
      },
      { new: true }
    ).populate('vendor');

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json({
      success: true,
      message: 'Product rejected',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Delete Product
export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json({
      success: true,
      message: 'Product deleted'
    });
  } catch (error) {
    next(error);
  }
};

// Get All Orders
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('buyer')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Support Tickets
export const getSupportTickets = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const tickets = await SupportTicket.find(query)
      .populate('user')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await SupportTicket.countDocuments(query);

    res.json({
      success: true,
      data: tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Resolve Support Ticket
export const resolveSupportTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { resolution } = req.body;

    const ticket = await SupportTicket.findByIdAndUpdate(
      ticketId,
      {
        status: 'resolved',
        resolution,
        resolvedAt: new Date(),
        resolvedBy: req.user._id
      },
      { new: true }
    ).populate('user');

    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    res.json({
      success: true,
      message: 'Ticket resolved',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// Get Platform Analytics
export const getPlatformAnalytics = async (req, res, next) => {
  try {
    const { period = 'monthly' } = req.query;

    const totalUsers = await User.countDocuments();
    const totalVendors = await Vendor.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalVendors,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        orderStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get User Statistics
export const getUserStatistics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        usersByRole
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Vendor Statistics
export const getVendorStatistics = async (req, res, next) => {
  try {
    const totalVendors = await Vendor.countDocuments();
    const verifiedVendors = await Vendor.countDocuments({ isVerified: true });
    const pendingVendors = await Vendor.countDocuments({ 'verification.status': 'pending' });

    const vendorsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          vendorCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalVendors,
        verifiedVendors,
        pendingVendors,
        vendorsByCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Order Statistics
export const getOrderStatistics = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const avgOrderValue = await Order.aggregate([
      { $group: { _id: null, avg: { $avg: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        ordersByStatus,
        totalRevenue: totalRevenue[0]?.total || 0,
        avgOrderValue: avgOrderValue[0]?.avg || 0
      }
    });
  } catch (error) {
    next(error);
  }
};
