import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  quotationNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  items: [{
    product: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    unit: String,
    specifications: String
  }],
  
  companyDetails: {
    name: String,
    contactPerson: String,
    phone: String,
    email: String,
    address: String
  },
  
  pricing: {
    subtotal: Number,
    tax: Number,
    discount: Number,
    shipping: Number,
    total: Number
  },
  
  deliveryTerms: String,
  paymentTerms: String,
  validityPeriod: Date,
  
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired', 'converted'],
    default: 'pending'
  },
  
  notes: String,
  attachments: [String],
  
  timeline: [{
    action: String,
    timestamp: Date,
    user: mongoose.Schema.Types.ObjectId
  }],
  
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

quotationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.quotationNumber = `QT-${Date.now()}-${count + 1}`;
  }
  next();
});

quotationSchema.index({ buyer: 1, createdAt: -1 });
quotationSchema.index({ vendor: 1, status: 1 });
quotationSchema.index({ status: 1, expiresAt: 1 });

export default mongoose.model('Quotation', quotationSchema);
