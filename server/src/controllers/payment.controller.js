import Transaction from '../models/Transaction.js';
import Order from '../models/Order.js';
import { AppError } from '../middleware/errorHandler.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpay = null;

const initRazorpay = () => {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpay;
};

// Create Payment Order (Razorpay)
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId, amount, currency = 'INR' } = req.body;

    if (!orderId || !amount) {
      throw new AppError('Order ID and amount are required', 400);
    }

    const razorpayInstance = initRazorpay();
    if (!razorpayInstance) {
      throw new AppError('Razorpay not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env', 500);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt: orderId,
      payment_capture: 1
    });

    res.json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: amount,
        currency: currency,
        orderId: orderId
      }
    });
  } catch (error) {
    next(error);
  }
};

// Verify Payment (Razorpay)
export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      throw new AppError('Missing required payment details', 400);
    }

    const razorpayInstance = initRazorpay();
    if (!razorpayInstance) {
      throw new AppError('Razorpay not configured', 500);
    }

    // Verify signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new AppError('Payment verification failed', 400);
    }

    // Fetch payment details from Razorpay
    const payment = await razorpayInstance.payments.fetch(paymentId);

    if (payment.status !== 'captured') {
      throw new AppError('Payment not captured', 400);
    }

    // Update order
    const order = await Order.findById(orderId);
    order.payment.status = 'completed';
    order.payment.transactionId = paymentId;
    order.payment.paidAt = new Date();
    order.status = 'confirmed';
    await order.save();

    // Create transaction record
    const transaction = new Transaction({
      user: req.user._id,
      type: 'debit',
      category: 'order_payment',
      amount: payment.amount / 100,
      reference: orderId,
      paymentMethod: 'razorpay',
      status: 'completed'
    });
    await transaction.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: orderId,
        transactionId: paymentId,
        status: 'completed'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Transaction History
export const getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Transaction by ID
export const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// Process Refund
export const processRefund = async (req, res, next) => {
  try {
    const { orderId, amount, reason } = req.body;

    const razorpayInstance = initRazorpay();
    if (!razorpayInstance) {
      throw new AppError('Razorpay not configured', 500);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    if (order.payment.status !== 'completed') {
      throw new AppError('Cannot refund unpaid orders', 400);
    }

    // Create refund in Razorpay
    if (order.payment.transactionId) {
      try {
        const refund = await razorpayInstance.payments.refund(order.payment.transactionId, {
          amount: amount * 100,
          notes: { reason }
        });

        // Update order
        order.status = 'refunded';
        order.payment.status = 'refunded';
        await order.save();

        // Create transaction record
        const transaction = new Transaction({
          user: req.user._id,
          type: 'credit',
          category: 'refund',
          amount: amount,
          reference: orderId,
          paymentMethod: 'razorpay',
          status: 'completed'
        });
        await transaction.save();

        res.json({
          success: true,
          message: 'Refund processed successfully',
          data: {
            refundId: refund.id,
            amount: amount,
            status: refund.status
          }
        });
      } catch (razorpayError) {
        throw new AppError('Refund processing failed', 500);
      }
    }
  } catch (error) {
    next(error);
  }
};

// Get Wallet Balance
export const getWalletBalance = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    let balance = 0;
    transactions.forEach(transaction => {
      if (transaction.type === 'credit') {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
    });

    res.json({
      success: true,
      data: {
        balance: Math.max(0, balance),
        transactions: transactions.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add Money to Wallet
export const addToWallet = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (amount <= 0) {
      throw new AppError('Amount must be greater than 0', 400);
    }

    const transaction = new Transaction({
      user: req.user._id,
      type: 'credit',
      category: 'wallet_topup',
      amount: amount,
      paymentMethod: 'card',
      status: 'completed'
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Money added to wallet',
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};
