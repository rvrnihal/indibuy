import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  businessType: {
    type: String,
    enum: ['manufacturer', 'supplier', 'retailer', 'contractor', 'distributor'],
    required: true
  },
  
  store: {
    name: { type: String, required: true },
    description: String,
    logo: String,
    banner: String,
    website: String,
    phone: String,
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    }
  },
  
  verification: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending'
    },
    gstVerified: Boolean,
    panVerified: Boolean,
    businessLicenseVerified: Boolean,
    identityVerified: Boolean,
    documents: [{
      type: String,
      url: String,
      uploadedAt: Date
    }],
    verifiedAt: Date,
    verifiedBy: mongoose.Schema.Types.ObjectId
  },
  
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    accountType: String
  },
  
  statistics: {
    totalProducts: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    responseTime: Number,
    cancellationRate: { type: Number, default: 0 }
  },
  
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'professional', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    autoRenew: Boolean
  },
  
  settings: {
    commissionRate: { type: Number, default: 5 },
    returnDays: { type: Number, default: 30 },
    shippingCharges: Number,
    policies: {
      returnPolicy: String,
      cancellationPolicy: String,
      privacyPolicy: String
    }
  },
  
  socialLinks: {
    facebook: String,
    instagram: String,
    linkedin: String,
    twitter: String
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

vendorSchema.index({ 'store.name': 'text', 'store.description': 'text' });
vendorSchema.index({ 'verification.status': 1 });
vendorSchema.index({ 'statistics.rating': -1 });

export default mongoose.model('Vendor', vendorSchema);
