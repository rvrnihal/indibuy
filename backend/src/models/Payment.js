import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
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
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'razorpay', 'stripe', 'cod', 'bank_transfer', 'wallet'],
      required: true
    },
    transactionId: {
      type: String,
      unique: true
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    stripePaymentIntentId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },
    receipt: {
      url: String,
      publicId: String
    },
    metadata: mongoose.Schema.Types.Mixed,
    failureReason: String
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
