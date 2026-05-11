import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Transaction from '../models/Transaction.js';
import AppError from '../middleware/errorHandler.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
export const createRazorpayOrder = async (orderId, amount, currency = 'INR') => {
  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt: orderId,
      payment_capture: 1
    });

    return {
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency
    };
  } catch (error) {
    throw new AppError(`Razorpay order creation failed: ${error.message}`, 500);
  }
};

// Verify Razorpay Payment
export const verifyRazorpayPayment = async (orderId, paymentId, signature) => {
  try {
    // Verify signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new AppError('Payment verification failed - Invalid signature', 400);
    }

    // Fetch payment details
    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status !== 'captured') {
      throw new AppError('Payment not captured', 400);
    }

    return {
      success: true,
      paymentId,
      status: payment.status,
      amount: payment.amount / 100,
      method: payment.method,
      email: payment.email,
      contact: payment.contact
    };
  } catch (error) {
    throw new AppError(`Razorpay verification failed: ${error.message}`, 400);
  }
};

// Handle Razorpay Webhook
export const handleRazorpayWebhook = async (event) => {
  try {
    const eventType = event.event;
    const eventData = event.payload.payment.entity;

    switch (eventType) {
      case 'payment.authorized':
        // Handle authorized payment
        console.log('Payment authorized:', eventData);
        break;

      case 'payment.failed':
        // Handle failed payment
        console.log('Payment failed:', eventData);
        const order = await Order.findOne({ 'payment.transactionId': eventData.id });
        if (order) {
          order.payment.status = 'failed';
          order.status = 'cancelled';
          await order.save();
        }
        break;

      case 'payment.captured':
        // Handle captured payment
        console.log('Payment captured:', eventData);
        break;

      case 'refund.created':
        // Handle refund
        console.log('Refund created:', eventData);
        break;

      default:
        console.log('Unknown event type:', eventType);
    }

    return { success: true };
  } catch (error) {
    throw new AppError(`Webhook processing failed: ${error.message}`, 500);
  }
};

// Process Razorpay Refund
export const processRazorpayRefund = async (paymentId, amount, reason) => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100,
      notes: { reason }
    });

    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status
    };
  } catch (error) {
    throw new AppError(`Razorpay refund failed: ${error.message}`, 500);
  }
};

// Get Payment Details
export const getRazorpayPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);

    return {
      success: true,
      paymentId: payment.id,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      createdAt: new Date(payment.created_at * 1000),
      notes: payment.notes
    };
  } catch (error) {
    throw new AppError(`Failed to fetch payment details: ${error.message}`, 500);
  }
};

// Get Order Details
export const getRazorpayOrderDetails = async (orderId) => {
  try {
    const order = await razorpay.orders.fetch(orderId);

    return {
      success: true,
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt,
      createdAt: new Date(order.created_at * 1000),
      payments: order.payments,
      notes: order.notes
    };
  } catch (error) {
    throw new AppError(`Failed to fetch order details: ${error.message}`, 500);
  }
};
