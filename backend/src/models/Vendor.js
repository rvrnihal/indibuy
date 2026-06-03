import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      unique: true
    },
    storeSlug: {
      type: String,
      unique: true,
      lowercase: true
    },
    storeDescription: String,
    storeLogo: {
      url: String,
      publicId: String
    },
    storeBanner: {
      url: String,
      publicId: String
    },
    businessLicense: {
      number: String,
      expiryDate: Date,
      document: {
        url: String,
        publicId: String
      }
    },
    gstNumber: {
      type: String,
      required: true,
      unique: true
    },
    panNumber: {
      type: String,
      required: true,
      unique: true
    },
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountType: String,
      verified: {
        type: Boolean,
        default: false
      }
    },
    businessAddress: {
      companyName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pinCode: String,
      country: String
    },
    contactPerson: {
      name: String,
      email: String,
      phone: String
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending'
    },
    verificationDocuments: [
      {
        type: String,
        url: String,
        publicId: String
      }
    ],
    ratings: {
      average: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    totalSales: {
      type: Number,
      default: 0
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    analytics: {
      monthlyRevenue: [
        {
          month: String,
          revenue: Number
        }
      ],
      topProducts: [
        {
          productId: mongoose.Schema.Types.ObjectId,
          sales: Number
        }
      ]
    },
    commissionRate: {
      type: Number,
      default: 5
    },
    wallet: {
      balance: {
        type: Number,
        default: 0
      },
      transactions: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'VendorTransaction'
        }
      ]
    },
    policies: {
      returnPolicy: String,
      refundPolicy: String,
      shippingPolicy: String
    },
    socialLinks: {
      website: String,
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isSuspended: {
      type: Boolean,
      default: false
    },
    suspensionReason: String,
    subscriptionPlan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    subscriptionExpiry: Date
  },
  { timestamps: true }
);

export default mongoose.model('Vendor', vendorSchema);
