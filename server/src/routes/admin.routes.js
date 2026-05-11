import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as adminController from '../controllers/admin.controller.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize(['admin']));

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Users
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserById);
router.put('/users/:userId/suspend', adminController.suspendUser);
router.put('/users/:userId/reactivate', adminController.reactivateUser);

// Vendors
router.get('/vendors', adminController.getAllVendors);
router.put('/vendors/:vendorId/approve', adminController.approveVendor);
router.put('/vendors/:vendorId/reject', adminController.rejectVendor);
router.put('/vendors/:vendorId/suspend', adminController.suspendVendor);

// Products
router.get('/products', adminController.getAllProducts);
router.put('/products/:productId/approve', adminController.approveProduct);
router.put('/products/:productId/reject', adminController.rejectProduct);
router.delete('/products/:productId', adminController.deleteProduct);

// Orders
router.get('/orders', adminController.getAllOrders);

// Support Tickets
router.get('/support-tickets', adminController.getSupportTickets);
router.put('/support-tickets/:ticketId/resolve', adminController.resolveSupportTicket);

// Analytics
router.get('/analytics', adminController.getPlatformAnalytics);
router.get('/analytics/users', adminController.getUserStatistics);
router.get('/analytics/vendors', adminController.getVendorStatistics);
router.get('/analytics/orders', adminController.getOrderStatistics);

export default router;
