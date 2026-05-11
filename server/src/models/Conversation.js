import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  
  type: {
    type: String,
    enum: ['buyer_vendor', 'buyer_support', 'vendor_admin'],
    default: 'buyer_vendor'
  },
  
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  subject: String,
  
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    attachments: [String],
    reactions: [{
      emoji: String,
      users: [mongoose.Schema.Types.ObjectId]
    }],
    isEdited: Boolean,
    editedAt: Date,
    read: Boolean,
    readAt: Date,
    createdAt: { type: Date, default: Date.now }
  }],
  
  lastMessage: {
    sender: mongoose.Schema.Types.ObjectId,
    preview: String,
    timestamp: Date
  },
  
  unreadCount: {
    type: Number,
    default: 0
  },
  
  status: {
    type: String,
    enum: ['active', 'archived', 'closed'],
    default: 'active'
  },
  
  resolution: {
    resolved: Boolean,
    resolvedAt: Date,
    resolution: String
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });
conversationSchema.index({ type: 1, status: 1 });

export default mongoose.model('Conversation', conversationSchema);
