import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
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
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  comment: {
    type: String,
    required: true
  },
  
  images: [String],
  video: String,
  
  verified: {
    type: Boolean,
    default: false
  },
  
  helpful: {
    count: { type: Number, default: 0 },
    users: [mongoose.Schema.Types.ObjectId]
  },
  
  unhelpful: {
    count: { type: Number, default: 0 },
    users: [mongoose.Schema.Types.ObjectId]
  },
  
  responses: [{
    respondent: mongoose.Schema.Types.ObjectId,
    comment: String,
    createdAt: Date
  }],
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  approvedAt: Date,
  approvedBy: mongoose.Schema.Types.ObjectId,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
