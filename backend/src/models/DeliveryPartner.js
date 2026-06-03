import mongoose from 'mongoose';

const deliveryPartnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    partnerName: {
      type: String,
      required: true
    },
    partnerType: {
      type: String,
      enum: ['individual', 'company'],
      required: true
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true
    },
    licenseExpiry: Date,
    vehicleDetails: {
      type: String,
      registrationNumber: String,
      vehicleType: String,
      capacity: Number
    },
    insurance: {
      policyNumber: String,
      expiryDate: Date,
      provider: String
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'suspended'],
      default: 'pending'
    },
    operatingAreas: [
      {
        city: String,
        state: String,
        pinCodes: [String]
      }
    ],
    serviceAreas: [mongoose.Schema.Types.ObjectId],
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
    activeOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      }
    ],
    completedDeliveries: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      verified: {
        type: Boolean,
        default: false
      }
    },
    documents: [
      {
        type: String,
        url: String,
        publicId: String
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    isSuspended: {
      type: Boolean,
      default: false
    },
    suspensionReason: String,
    location: {
      latitude: Number,
      longitude: Number,
      lastUpdated: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model('DeliveryPartner', deliveryPartnerSchema);
