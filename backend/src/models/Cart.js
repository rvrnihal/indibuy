import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
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
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          original: Number,
          discounted: Number
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    couponCode: String,
    discountAmount: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model('Cart', cartSchema);
