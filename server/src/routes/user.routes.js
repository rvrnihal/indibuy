import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.use(authenticate);

// Profile endpoints
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);
router.post('/change-password', userController.changePassword);

// Address endpoints
router.post('/addresses', userController.addAddress);
router.get('/addresses', userController.getAddresses);
router.put('/addresses/:addressId', userController.updateAddress);
router.delete('/addresses/:addressId', userController.deleteAddress);

// Wishlist endpoints
router.get('/wishlist', userController.getWishlist);
router.post('/wishlist', userController.addToWishlist);
router.delete('/wishlist', userController.removeFromWishlist);
router.delete('/wishlist/clear', userController.clearWishlist);

// KYC endpoints
router.put('/kyc', userController.updateKYC);

// Stats and preferences
router.get('/stats', userController.getUserStats);
router.get('/preferences', userController.getPreferences);
router.put('/preferences', userController.updatePreferences);

export default router;
