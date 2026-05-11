import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema({
  refundId: {
    type: String,
    unique: true,
    required: true
  },
  
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  
  user: {
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
    reason: String,
    notes: String
  }],
  
  reason: {
    type: String,
    required: true,
    enum: [
      'defective_product',
      'wrong_item',
      'not_as_described',
      'damaged',
      'change_of_mind',
      'duplicate',
      'better_price_found',
      'other'
    ]
  },
  
  amount: {
    subtotal: Number,
    tax: Number,
    shipping: Number,
    discount: Number,
    total: Number,
    currency: { type: String, default: 'INR' }
  },
  
  status: {
    type: String,
    enum: ['initiated', 'approved', 'rejected', 'return_shipped', 'item_received', 'processed', 'completed', 'cancelled'],
    default: 'initiated'
  },
  
  proofOfReturn: {
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  
  attachments: [String],
  
  timeline: [{
    status: String,
    timestamp: Date,
    note: String,
    actor: mongoose.Schema.Types.ObjectId
  }],
  
  refundMethod: {
    type: String,
    enum: ['wallet', 'original_payment', 'bank_transfer'],
    default: 'wallet'
  },
  
  refundDate: Date,
  
  notes: String,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

refundSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.refundId = `RFD-${Date.now()}-${count + 1}`;
  }
  next();
});

refundSchema.index({ order: 1 });
refundSchema.index({ user: 1, createdAt: -1 });
refundSchema.index({ status: 1 });

export default mongoose.model('Refund', refundSchema);
