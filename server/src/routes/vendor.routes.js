import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as vendorController from '../controllers/vendor.controller.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize(['vendor', 'admin']));

// Dashboard
router.get('/dashboard', vendorController.getVendorDashboard);

// Products
router.get('/products', vendorController.getVendorProducts);

// Orders
router.get('/orders', vendorController.getVendorOrders);

// Analytics
router.get('/analytics', vendorController.getVendorAnalytics);

// Profile and settings
router.put('/profile', vendorController.updateVendorProfile);
router.put('/settings', vendorController.updateVendorSettings);

// Verification
router.post('/request-verification', vendorController.requestVerification);

// Statistics
router.get('/stats', vendorController.getVendorStats);

// Earnings
router.post('/withdraw', vendorController.withdrawEarnings);

// Reviews
router.get('/reviews', vendorController.getVendorReviews);

// Public vendor info
router.get('/:vendorId', vendorController.getVendorById);

export default router;
