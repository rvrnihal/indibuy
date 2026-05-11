import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import AppError from '../middleware/errorHandler.js';

// Create Review
export const createReview = async (req, res, next) => {
  try {
    const { productId, orderId, rating, title, comment, images, video } = req.body;

    if (!productId || !rating) {
      throw new AppError('Product ID and rating are required', 400);
    }

    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    // Check if user has purchased this product
    const order = await Order.findOne({
      _id: orderId,
      buyer: req.user._id,
      'items.product': productId
    });

    if (!order) {
      throw new AppError('You can only review products you have purchased', 400);
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      product: productId,
      reviewer: req.user._id
    });

    if (existingReview) {
      throw new AppError('You have already reviewed this product', 400);
    }

    const review = new Review({
      product: productId,
      order: orderId,
      reviewer: req.user._id,
      rating,
      title,
      comment,
      images,
      video,
      verified: true
    });

    await review.save();
    await review.populate('reviewer product');

    // Update product ratings
    const allReviews = await Review.find({
      product: productId,
      status: 'approved'
    });

    let totalRating = 0;
    allReviews.forEach(r => (totalRating += r.rating));
    const avgRating = (totalRating / allReviews.length).toFixed(2);

    await Product.findByIdAndUpdate(productId, {
      'ratings.average': avgRating,
      'ratings.count': allReviews.length
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// Get Product Reviews
export const getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy = 'newest' } = req.query;
    const { productId } = req.params;

    let sortOptions = {};
    if (sortBy === 'rating-high') sortOptions = { rating: -1 };
    if (sortBy === 'rating-low') sortOptions = { rating: 1 };
    if (sortBy === 'helpful') sortOptions = { 'helpful.count': -1 };
    if (sortBy === 'newest') sortOptions = { createdAt: -1 };

    const reviews = await Review.find({
      product: productId,
      status: 'approved'
    })
      .populate('reviewer')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Review.countDocuments({
      product: productId,
      status: 'approved'
    });

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

// Get User Reviews
export const getUserReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ reviewer: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Review.countDocuments({ reviewer: req.user._id });

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

// Update Review
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, images } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to update this review', 403);
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        throw new AppError('Rating must be between 1 and 5', 400);
      }
      review.rating = rating;
    }

    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (images) review.images = images;
    review.isEdited = true;
    review.editedAt = new Date();

    await review.save();
    await review.populate('reviewer product');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// Delete Review
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to delete this review', 403);
    }

    await Review.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Mark as Helpful
export const markHelpful = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    const alreadyMarked = review.helpful.users.includes(req.user._id);

    if (alreadyMarked) {
      review.helpful.users = review.helpful.users.filter(
        u => u.toString() !== req.user._id.toString()
      );
      review.helpful.count -= 1;
    } else {
      review.helpful.users.push(req.user._id);
      review.helpful.count += 1;
    }

    await review.save();

    res.json({
      success: true,
      message: alreadyMarked ? 'Removed from helpful' : 'Marked as helpful',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// Respond to Review
export const respondToReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    review.responses.push({
      respondent: req.user._id,
      comment,
      createdAt: new Date()
    });

    await review.save();
    await review.populate('reviewer product');

    res.json({
      success: true,
      message: 'Response added successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// Get Review Stats
export const getReviewStats = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      product: productId,
      status: 'approved'
    });

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    let totalRating = 0;

    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
      totalRating += review.rating;
    });

    const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        totalReviews: reviews.length,
        averageRating: avgRating,
        ratingDistribution,
        verifiedReviews: reviews.filter(r => r.verified).length
      }
    });
  } catch (error) {
    next(error);
  }
};
