import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor'
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000
    },
    images: [
      {
        url: String,
        publicId: String
      }
    ],
    videos: [String],
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0
    },
    unhelpful: {
      type: Number,
      default: 0
    },
    responses: [
      {
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        comment: String,
        createdAt: Date
      }
    ],
    isApproved: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'reported'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

// Index for faster queries
reviewSchema.index({ product: 1, rating: 1 });
reviewSchema.index({ reviewer: 1 });

export default mongoose.model('Review', reviewSchema);
