import Vendor from '../models/Vendor.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Analytics from '../models/Analytics.js';
import AppError from '../middleware/errorHandler.js';

// Get Vendor Dashboard
export const getVendorDashboard = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ owner: req.user._id });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    const products = await Product.find({ vendor: vendor._id });
    const orders = await Order.find({ 'items.vendor': vendor._id });

    // Calculate stats
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const avgRating = vendor.ratings?.average || 0;

    res.json({
      success: true,
      data: {
        vendor,
        stats: {
          totalProducts,
          totalOrders,
          totalRevenue,
          avgRating,
          verificationStatus: vendor.isVerified ? 'verified' : 'pending'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Vendor Products
export const getVendorProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const vendor = await Vendor.findOne({ owner: req.user._id });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    const query = { vendor: vendor._id };
    if (status) query.status = status;

    const products = await Product.find(query)
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

// Get Vendor Orders
export const getVendorOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const vendor = await Vendor.findOne({ owner: req.user._id });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    const query = { 'items.vendor': vendor._id };
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

// Get Vendor Analytics
export const getVendorAnalytics = async (req, res, next) => {
  try {
    const { period = 'monthly' } = req.query;

    const vendor = await Vendor.findOne({ owner: req.user._id });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    const analytics = await Analytics.findOne({
      vendor: vendor._id,
      period
    });

    if (!analytics) {
      return res.json({
        success: true,
        data: {
          revenue: 0,
          orders: 0,
          products: 0,
          customers: 0
        }
      });
    }

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// Update Vendor Profile
export const updateVendorProfile = async (req, res, next) => {
  try {
    const { businessName, description, logo, banner, phone, website } = req.body;

    const vendor = await Vendor.findOne({ owner: req.user._id });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    if (businessName) vendor.businessName = businessName;
    if (description) vendor.description = description;
    if (logo) vendor.logo = logo;
    if (banner) vendor.banner = banner;
    if (phone) vendor.phone = phone;
    if (website) vendor.website = website;

    await vendor.save();

    res.json({
      success: true,
      message: 'Vendor profile updated',
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// Update Vendor Settings
export const updateVendorSettings = async (req, res, next) => {
  try {
    const { commissionRate, shippingPolicy, returnPolicy, bankDetails } = req.body;

    const vendor = await Vendor.findOne({ owner: req.user._id });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    if (commissionRate !== undefined) vendor.commissionRate = commissionRate;
    if (shippingPolicy) vendor.shippingPolicy = shippingPolicy;
    if (returnPolicy) vendor.returnPolicy = returnPolicy;
    if (bankDetails) vendor.bankDetails = bankDetails;

    await vendor.save();

    res.json({
      success: true,
      message: 'Vendor settings updated',
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// Request Verification
export const requestVerification = async (req, res, next) => {
  try {
    const { documents } = req.body;

    const vendor = await Vendor.findOne({ owner: req.user._id });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    if (vendor.isVerified) {
      throw new AppError('Vendor is already verified', 400);
    }

    vendor.verification = {
      status: 'pending',
      documents,
      submittedAt: new Date()
    };

    await vendor.save();

    res.json({
      success: true,
      message: 'Verification request submitted',
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// Get Vendor Stats
export const getVendorStats = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ owner: req.user._id });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    const products = await Product.find({ vendor: vendor._id });
    const orders = await Order.find({ 'items.vendor': vendor._id });

    const totalRevenue = orders.reduce((sum, order) => {
      const vendorItems = order.items.filter(item => item.vendor.toString() === vendor._id.toString());
      return sum + vendorItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
    }, 0);

    const totalOrders = orders.length;
    const totalProducts = products.length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        completedOrders,
        totalRevenue,
        avgRating: vendor.ratings?.average || 0,
        reviewCount: vendor.ratings?.count || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Vendor by ID
export const getVendorById = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId).select('-bankDetails -verification');

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    const products = await Product.find({ vendor: vendorId }).limit(5);
    const avgRating = vendor.ratings?.average || 0;
    const totalReviews = vendor.ratings?.count || 0;

    res.json({
      success: true,
      data: {
        vendor,
        products,
        avgRating,
        totalReviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// Withdraw Earnings
export const withdrawEarnings = async (req, res, next) => {
  try {
    const { amount, bankDetails } = req.body;

    const vendor = await Vendor.findOne({ owner: req.user._id });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    if (vendor.wallet < amount) {
      throw new AppError('Insufficient balance', 400);
    }

    vendor.wallet -= amount;
    vendor.withdrawals = vendor.withdrawals || [];
    vendor.withdrawals.push({
      amount,
      bankDetails,
      status: 'pending',
      requestedAt: new Date()
    });

    await vendor.save();

    res.json({
      success: true,
      message: 'Withdrawal request submitted',
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// Get Vendor Reviews
export const getVendorReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const vendor = await Vendor.findOne({ owner: req.user._id });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    const products = await Product.find({ vendor: vendor._id });
    const productIds = products.map(p => p._id);

    const Review = require('../models/Review.js').default;
    const reviews = await Review.find({ product: { $in: productIds } })
      .populate('reviewer product')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Review.countDocuments({ product: { $in: productIds } });

    res.json({
      success: true,
      data: reviews,
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
