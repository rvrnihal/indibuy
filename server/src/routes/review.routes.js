import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as reviewController from '../controllers/review.controller.js';

const router = express.Router();

router.use(authenticate);

// Get product reviews
router.get('/product/:productId', reviewController.getProductReviews);

// Get review stats
router.get('/stats/:productId', reviewController.getReviewStats);

// Create review
router.post('/', reviewController.createReview);

// Get user reviews
router.get('/user/my-reviews', reviewController.getUserReviews);

// Update review
router.put('/:id', reviewController.updateReview);

// Delete review
router.delete('/:id', reviewController.deleteReview);

// Mark as helpful
router.post('/:id/helpful', reviewController.markHelpful);

// Respond to review
router.post('/:id/respond', reviewController.respondToReview);

export default router;
