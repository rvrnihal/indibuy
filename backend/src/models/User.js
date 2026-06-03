import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      minlength: 6,
      select: false
    },
    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid phone number']
    },
    avatar: {
      url: String,
      publicId: String
    },
    role: {
      type: String,
      enum: ['buyer', 'vendor', 'admin', 'delivery_partner'],
      default: 'buyer'
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpiry: Date,
    passwordResetToken: String,
    passwordResetExpiry: Date,
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    isBanned: {
      type: Boolean,
      default: false
    },
    preferences: {
      darkMode: {
        type: Boolean,
        default: false
      },
      language: {
        type: String,
        default: 'en'
      },
      currency: {
        type: String,
        default: 'INR'
      },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true }
      }
    },
    socialLogin: {
      google: {
        id: String,
        email: String
      },
      facebook: {
        id: String,
        email: String
      }
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
      }
    ],
    defaultAddress: mongoose.Schema.Types.ObjectId,
    businessInfo: {
      companyName: String,
      gstNumber: String,
      businessType: String,
      industry: String,
      website: String,
      officeAddress: String
    },
    wallet: {
      balance: {
        type: Number,
        default: 0
      },
      transactions: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'WalletTransaction'
        }
      ]
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true
    },
    referredBy: mongoose.Schema.Types.ObjectId
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

// Method to generate JWT token
userSchema.methods.getJWTToken = function (req) {
  // To be implemented with JWT logic
  return '';
};

// Method to get profile details
userSchema.methods.getProfile = function () {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  return user;
};

export default mongoose.model('User', userSchema);
