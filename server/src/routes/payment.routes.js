import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as paymentController from '../controllers/payment.controller.js';

const router = express.Router();

router.use(authenticate);

// Create payment order
router.post('/create-order', paymentController.createPaymentOrder);

// Verify payment
router.post('/verify', paymentController.verifyPayment);

// Get transactions
router.get('/transactions', paymentController.getTransactions);

// Get transaction by ID
router.get('/transactions/:id', paymentController.getTransaction);

// Process refund
router.post('/refund', paymentController.processRefund);

// Get wallet balance
router.get('/wallet/balance', paymentController.getWalletBalance);

// Add to wallet
router.post('/wallet/add', paymentController.addToWallet);

export default router;
