import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: [
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
        addedAt: {
          type: Date,
          default: Date.now
        },
        priceAtTime: Number
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Wishlist', wishlistSchema);
