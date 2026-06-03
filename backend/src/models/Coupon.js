import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    description: String,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    discountValue: {
      type: Number,
      required: true
    },
    minOrderAmount: {
      type: Number,
      default: 0
    },
    maxDiscount: Number,
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    usageLimit: {
      totalUses: Number,
      perUserUses: {
        type: Number,
        default: 1
      }
    },
    usageCount: {
      totalUsed: {
        type: Number,
        default: 0
      },
      usedBy: [
        {
          user: mongoose.Schema.Types.ObjectId,
          count: { type: Number, default: 1 }
        }
      ]
    },
    validity: {
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      },
      isActive: {
        type: Boolean,
        default: true
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Coupon', couponSchema);
