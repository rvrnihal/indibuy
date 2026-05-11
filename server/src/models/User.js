import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Invalid phone number']
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['buyer', 'vendor', 'admin', 'delivery_partner'],
    default: 'buyer'
  },
  profileImage: String,
  bio: String,
  companyName: String,
  businessType: {
    type: String,
    enum: ['manufacturer', 'supplier', 'retailer', 'contractor', 'distributor']
  },
  gstNumber: String,
  panNumber: String,
  businessLicense: String,
  
  addresses: [{
    type: String,
    label: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }],
  
  verification: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    identity: { type: Boolean, default: false },
    business: { type: Boolean, default: false }
  },
  
  kycDetails: {
    documentType: String,
    documentNumber: String,
    verifiedAt: Date,
    verifiedBy: mongoose.Schema.Types.ObjectId
  },
  
  preferences: {
    notifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'INR' }
  },
  
  wallet: {
    balance: { type: Number, default: 0 },
    transactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }]
  },
  
  referralCode: String,
  referredBy: mongoose.Schema.Types.ObjectId,
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'banned'],
    default: 'active'
  },
  
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user without password
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
