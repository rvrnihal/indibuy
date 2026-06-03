import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    },
    companyName: String,
    addressLine1: {
      type: String,
      required: true,
      trim: true
    },
    addressLine2: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pinCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    },
    addressType: {
      type: String,
      enum: ['home', 'office', 'warehouse'],
      default: 'home'
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    location: {
      latitude: Number,
      longitude: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model('Address', addressSchema);
