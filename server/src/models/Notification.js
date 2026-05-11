import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  type: {
    type: String,
    enum: [
      'order_placed',
      'order_confirmed',
      'order_shipped',
      'order_delivered',
      'payment_received',
      'product_available',
      'price_drop',
      'new_message',
      'vendor_verification',
      'review_approved',
      'promotion',
      'account_security',
      'system'
    ],
    required: true
  },
  
  title: {
    type: String,
    required: true
  },
  
  message: {
    type: String,
    required: true
  },
  
  data: {
    orderId: mongoose.Schema.Types.ObjectId,
    productId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    url: String,
    action: String
  },
  
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false }
  },
  
  status: {
    read: { type: Boolean, default: false },
    readAt: Date,
    sent: { type: Boolean, default: true },
    sentAt: Date
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  createdAt: { type: Date, default: Date.now, index: true },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
}, { timestamps: true });

// Index for efficient queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, 'status.read': 1 });

export default mongoose.model('Notification', notificationSchema);
