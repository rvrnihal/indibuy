import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
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
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        vendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Vendor'
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          original: Number,
          discounted: Number
        },
        gst: {
          rate: Number,
          amount: Number
        },
        subtotal: Number,
        status: {
          type: String,
          enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
          default: 'pending'
        },
        deliveryDate: Date
      }
    ],
    shippingAddress: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      companyName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pinCode: String,
      country: String
    },
    billingAddress: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      companyName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pinCode: String,
      country: String
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true
      },
      discount: {
        type: Number,
        default: 0
      },
      couponCode: String,
      shipping: {
        type: Number,
        default: 0
      },
      gst: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        required: true
      }
    },
    payment: {
      method: {
        type: String,
        enum: ['credit_card', 'debit_card', 'razorpay', 'stripe', 'cod', 'bank_transfer', 'wallet'],
        required: true
      },
      transactionId: String,
      razorpayOrderId: String,
      razorpayPaymentId: String,
      stripePaymentIntentId: String,
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
      },
      paidAt: Date,
      receipt: {
        url: String,
        publicId: String
      }
    },
    invoice: {
      number: String,
      url: String,
      publicId: String,
      generatedAt: Date
    },
    delivery: {
      partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPartner'
      },
      estimatedDelivery: Date,
      actualDelivery: Date,
      tracking: {
        url: String,
        status: String,
        lastUpdate: Date,
        location: {
          latitude: Number,
          longitude: Number
        }
      },
      otp: String,
      otpVerified: {
        type: Boolean,
        default: false
      }
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },
    timeline: [
      {
        status: String,
        timestamp: Date,
        notes: String
      }
    ],
    notes: String,
    specialInstructions: String,
    refund: {
      requested: {
        type: Boolean,
        default: false
      },
      reason: String,
      status: String,
      amount: Number,
      processedAt: Date
    },
    warranty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warranty'
    }
  },
  { timestamps: true }
);

// Index for faster queries
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

export default mongoose.model('Order', orderSchema);
