import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    addedAt: { type: Date, default: Date.now }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

wishlistSchema.index({ user: 1, 'products.product': 1 }, { unique: true });

export default mongoose.model('Wishlist', wishlistSchema);
