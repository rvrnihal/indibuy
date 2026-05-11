import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: Number,
    totalPrice: Number
  }],
  
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    landmark: String
  },
  
  billingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  pricing: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'netbanking', 'wallet', 'cod'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending'
    },
    transactionId: String,
    paymentGateway: String,
    paidAt: Date,
    receiptUrl: String
  },
  
  order: {
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'],
      default: 'pending'
    },
    timeline: [{
      status: String,
      timestamp: Date,
      note: String
    }]
  },
  
  shipping: {
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight'],
      default: 'standard'
    },
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    deliveryPartner: mongoose.Schema.Types.ObjectId
  },
  
  invoice: {
    number: String,
    url: String,
    generatedAt: Date
  },
  
  notes: String,
  
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
