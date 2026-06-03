import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema(
  {
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
      ref: 'Vendor'
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: {
          type: Number,
          required: true
        },
        unitPrice: Number,
        totalPrice: Number,
        specifications: String
      }
    ],
    description: String,
    notes: String,
    deliveryAddress: {
      city: String,
      state: String,
      pinCode: String,
      country: String
    },
    deliveryRequired: {
      type: Boolean,
      default: false
    },
    estimatedDelivery: Date,
    pricing: {
      subtotal: Number,
      shipping: Number,
      gst: Number,
      total: Number
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
      default: 'draft'
    },
    validUntil: Date,
    attachments: [
      {
        url: String,
        publicId: String
      }
    ],
    conversation: [
      {
        sender: mongoose.Schema.Types.ObjectId,
        message: String,
        timestamp: Date
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Quotation', quotationSchema);
