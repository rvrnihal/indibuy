import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  
  description: String,
  
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0
    }
  },
  
  conditions: {
    minPurchase: { type: Number, default: 0 },
    maxDiscount: Number,
    applicableCategories: [String],
    applicableProducts: [mongoose.Schema.Types.ObjectId],
    excludeProducts: [mongoose.Schema.Types.ObjectId],
    userTypes: {
      type: [String],
      enum: ['new', 'existing', 'premium'],
      default: ['new', 'existing', 'premium']
    }
  },
  
  validity: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  
  usage: {
    maxUses: Number,
    maxUsesPerUser: { type: Number, default: 1 },
    currentUses: { type: Number, default: 0 },
    usedBy: [mongoose.Schema.Types.ObjectId]
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active'
  },
  
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
