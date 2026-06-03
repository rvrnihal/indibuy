import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema(
  {
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
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    category: {
      type: String,
      enum: ['order', 'payment', 'delivery', 'product', 'vendor', 'account', 'other'],
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
    attachments: [
      {
        url: String,
        publicId: String
      }
    ],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'],
      default: 'open'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        message: String,
        attachments: [{
          url: String,
          publicId: String
        }],
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    resolution: {
      resolvedBy: mongoose.Schema.Types.ObjectId,
      resolutionNotes: String,
      resolvedAt: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model('SupportTicket', supportTicketSchema);
