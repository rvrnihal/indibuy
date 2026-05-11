import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    index: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  category: {
    type: String,
    required: true,
    enum: [
      'Cement & Concrete',
      'Steel & Iron',
      'Pipes & Fittings',
      'Electrical',
      'Tiles & Flooring',
      'Paint & Chemicals',
      'Safety Equipment',
      'Machinery',
      'Hardware',
      'Other'
    ]
  },
  
  subcategory: String,
  
  sku: {
    type: String,
    required: true,
    unique: true
  },
  
  price: {
    type: Number,
    required: true,
    min: 0
  },
  
  costPrice: Number,
  
  discount: {
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    fixedAmount: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date
  },
  
  finalPrice: {
    type: Number,
    required: true
  },
  
  stock: {
    quantity: { type: Number, required: true, default: 0 },
    unit: String,
    minOrderQuantity: { type: Number, default: 1 },
    maxOrderQuantity: Number,
    reserved: { type: Number, default: 0 }
  },
  
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  
  video: String,
  
  specifications: [{
    key: String,
    value: String
  }],
  
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    distribution: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    shippingCost: Number,
    freeShipping: Boolean,
    deliveryDays: Number
  },
  
  warehouse: {
    location: String,
    addressId: mongoose.Schema.Types.ObjectId
  },
  
  warranty: {
    duration: Number,
    unit: String,
    type: String
  },
  
  returnable: {
    allowed: { type: Boolean, default: true },
    days: { type: Number, default: 30 },
    conditions: String
  },
  
  tags: [String],
  
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued', 'pending_approval', 'rejected'],
    default: 'pending_approval'
  },
  
  approvedAt: Date,
  approvedBy: mongoose.Schema.Types.ObjectId,
  
  viewCount: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
  
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, vendor: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ finalPrice: 1 });

// Calculate final price before saving
productSchema.pre('save', function(next) {
  if (this.isModified('price') || this.isModified('discount')) {
    let finalPrice = this.price;
    
    if (this.discount.percentage > 0) {
      finalPrice = this.price * (1 - this.discount.percentage / 100);
    }
    
    if (this.discount.fixedAmount > 0) {
      finalPrice = Math.max(0, finalPrice - this.discount.fixedAmount);
    }
    
    this.finalPrice = Math.round(finalPrice * 100) / 100;
  }
  next();
});

export default mongoose.model('Product', productSchema);
