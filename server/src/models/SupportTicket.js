import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  category: {
    type: String,
    enum: [
      'product_quality',
      'delivery_issue',
      'payment_issue',
      'order_issue',
      'refund_request',
      'vendor_issue',
      'account_issue',
      'technical_issue',
      'other'
    ],
    required: true
  },
  
  subject: {
    type: String,
    required: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  status: {
    type: String,
    enum: ['open', 'in_progress', 'pending_user', 'resolved', 'closed'],
    default: 'open'
  },
  
  attachments: [String],
  
  replies: [{
    user: mongoose.Schema.Types.ObjectId,
    message: String,
    attachments: [String],
    createdAt: { type: Date, default: Date.now }
  }],
  
  assignment: {
    agent: mongoose.Schema.Types.ObjectId,
    assignedAt: Date
  },
  
  resolution: {
    resolution: String,
    resolvedAt: Date,
    resolvedBy: mongoose.Schema.Types.ObjectId
  },
  
  feedback: {
    rating: Number,
    comment: String,
    submittedAt: Date
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  closedAt: Date
}, { timestamps: true });

supportTicketSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.ticketNumber = `TKT-${Date.now()}-${count + 1}`;
  }
  next();
});

supportTicketSchema.index({ user: 1, status: 1, createdAt: -1 });
supportTicketSchema.index({ status: 1, priority: 1 });

export default mongoose.model('SupportTicket', supportTicketSchema);
