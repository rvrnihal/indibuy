import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['order', 'payment', 'delivery', 'promotion', 'system', 'vendor', 'review'],
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
    image: String,
    relatedEntity: {
      entityType: String,
      entityId: mongoose.Schema.Types.ObjectId
    },
    channel: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true }
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed'],
      default: 'sent'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date,
    actionUrl: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

// Index for faster queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
