import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  
  category: {
    type: String,
    enum: ['order_payment', 'refund', 'wallet_topup', 'wallet_usage', 'cashback', 'reward', 'adjustment'],
    required: true
  },
  
  amount: {
    type: Number,
    required: true
  },
  
  reference: {
    orderId: mongoose.Schema.Types.ObjectId,
    refundId: mongoose.Schema.Types.ObjectId,
    paymentId: String
  },
  
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'netbanking', 'wallet', 'cod']
  },
  
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  
  description: String,
  notes: String,
  
  walletBalanceBefore: Number,
  walletBalanceAfter: Number,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

transactionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.transactionId = `TXN-${Date.now()}-${count + 1}`;
  }
  next();
});

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Transaction', transactionSchema);
