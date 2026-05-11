import crypto from 'crypto';
import Order from '../models/Order.js';
import Transaction from '../models/Transaction.js';
import AppError from '../middleware/errorHandler.js';
import { handleRazorpayWebhook } from './razorpay.js';
import { handleStripeWebhook } from './stripe.js';

// Verify Razorpay Webhook Signature
export const verifyRazorpayWebhookSignature = (body, signature) => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    return false;
  }
};

// Verify Stripe Webhook Signature
export const verifyStripeWebhookSignature = (body, signature) => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    return false;
  }
};

// Process Razorpay Webhook
export const processRazorpayWebhook = async (body, signature) => {
  try {
    // Verify signature
    if (!verifyRazorpayWebhookSignature(body, signature)) {
      throw new AppError('Invalid webhook signature', 401);
    }

    const event = JSON.parse(body);
    
    // Handle webhook based on event type
    switch (event.event) {
      case 'payment.authorized':
        await handlePaymentAuthorized(event.payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;

      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;

      case 'refund.created':
        await handleRefundCreated(event.payload.refund.entity);
        break;

      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity);
        break;

      default:
        console.log(`Unhandled Razorpay event: ${event.event}`);
    }

    return { success: true, event: event.event };
  } catch (error) {
    throw new AppError(`Webhook processing failed: ${error.message}`, 500);
  }
};

// Process Stripe Webhook
export const processStripeWebhook = async (body, signature) => {
  try {
    // Verify signature
    if (!verifyStripeWebhookSignature(body, signature)) {
      throw new AppError('Invalid webhook signature', 401);
    }

    const event = JSON.parse(body);

    // Handle webhook based on event type
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handleStripePaymentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handleStripePaymentFailed(event.data.object);
        break;

      case 'charge.refunded':
        await handleStripeChargeRefunded(event.data.object);
        break;

      case 'customer.subscription.updated':
        console.log('Subscription updated:', event.data.object.id);
        break;

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return { success: true, event: event.type };
  } catch (error) {
    throw new AppError(`Webhook processing failed: ${error.message}`, 500);
  }
};

// Handler: Payment Authorized (Razorpay)
const handlePaymentAuthorized = async (payment) => {
  console.log('Payment authorized:', payment.id);
  // Additional processing if needed
};

// Handler: Payment Failed (Razorpay)
const handlePaymentFailed = async (payment) => {
  try {
    console.log('Payment failed:', payment.id);
    
    const order = await Order.findOne({ 'payment.transactionId': payment.id });
    if (order) {
      order.payment.status = 'failed';
      order.status = 'cancelled';
      order.timeline.push({
        status: 'cancelled',
        timestamp: new Date(),
        message: 'Payment failed'
      });
      await order.save();
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

// Handler: Payment Captured (Razorpay)
const handlePaymentCaptured = async (payment) => {
  try {
    console.log('Payment captured:', payment.id);
    
    const order = await Order.findOne({ 'payment.transactionId': payment.id });
    if (order) {
      order.payment.status = 'completed';
      order.status = 'confirmed';
      order.timeline.push({
        status: 'confirmed',
        timestamp: new Date(),
        message: 'Payment captured and confirmed'
      });
      await order.save();

      // Create transaction record
      const transaction = new Transaction({
        user: order.buyer,
        type: 'debit',
        category: 'order_payment',
        amount: payment.amount / 100,
        reference: order._id,
        paymentMethod: 'razorpay',
        status: 'completed',
        transactionId: payment.id
      });
      await transaction.save();
    }
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
};

// Handler: Order Paid (Razorpay)
const handleOrderPaid = async (order) => {
  try {
    console.log('Order paid:', order.id);
    // Additional processing if needed
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
};

// Handler: Refund Created (Razorpay)
const handleRefundCreated = async (refund) => {
  try {
    console.log('Refund created:', refund.id);
    
    const order = await Order.findOne({ 'payment.transactionId': refund.payment_id });
    if (order) {
      order.status = 'refunded';
      order.payment.status = 'refunded';
      await order.save();

      // Create transaction record
      const transaction = new Transaction({
        user: order.buyer,
        type: 'credit',
        category: 'refund',
        amount: refund.amount / 100,
        reference: order._id,
        paymentMethod: 'razorpay',
        status: 'completed',
        transactionId: refund.id
      });
      await transaction.save();
    }
  } catch (error) {
    console.error('Error handling refund created:', error);
  }
};

// Handler: Stripe Payment Succeeded
const handleStripePaymentSucceeded = async (paymentIntent) => {
  try {
    console.log('Stripe payment succeeded:', paymentIntent.id);
    
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) return;

    const order = await Order.findById(orderId);
    if (order) {
      order.payment.status = 'completed';
      order.payment.transactionId = paymentIntent.charges.data[0]?.id;
      order.status = 'confirmed';
      order.timeline.push({
        status: 'confirmed',
        timestamp: new Date(),
        message: 'Payment confirmed via Stripe'
      });
      await order.save();

      // Create transaction record
      const transaction = new Transaction({
        user: order.buyer,
        type: 'debit',
        category: 'order_payment',
        amount: paymentIntent.amount / 100,
        reference: orderId,
        paymentMethod: 'stripe',
        status: 'completed',
        transactionId: paymentIntent.id
      });
      await transaction.save();
    }
  } catch (error) {
    console.error('Error handling Stripe payment succeeded:', error);
  }
};

// Handler: Stripe Payment Failed
const handleStripePaymentFailed = async (paymentIntent) => {
  try {
    console.log('Stripe payment failed:', paymentIntent.id);
    
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) return;

    const order = await Order.findById(orderId);
    if (order) {
      order.payment.status = 'failed';
      order.status = 'cancelled';
      order.timeline.push({
        status: 'cancelled',
        timestamp: new Date(),
        message: 'Payment failed via Stripe'
      });
      await order.save();
    }
  } catch (error) {
    console.error('Error handling Stripe payment failed:', error);
  }
};

// Handler: Stripe Charge Refunded
const handleStripeChargeRefunded = async (charge) => {
  try {
    console.log('Stripe charge refunded:', charge.id);
    
    const order = await Order.findOne({ 'payment.transactionId': charge.id });
    if (order) {
      order.status = 'refunded';
      order.payment.status = 'refunded';
      await order.save();

      // Create transaction record
      const transaction = new Transaction({
        user: order.buyer,
        type: 'credit',
        category: 'refund',
        amount: charge.refunds.data[0]?.amount / 100 || charge.amount / 100,
        reference: order._id,
        paymentMethod: 'stripe',
        status: 'completed',
        transactionId: charge.id
      });
      await transaction.save();
    }
  } catch (error) {
    console.error('Error handling Stripe charge refunded:', error);
  }
};

// Sync Payment Status
export const syncPaymentStatus = async (orderId, transactionId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check payment status from payment gateway
    // This is a utility function that can be called to sync status
    const currentStatus = order.payment.status;
    
    return {
      success: true,
      orderId,
      currentStatus,
      transactionId
    };
  } catch (error) {
    throw new AppError(`Payment sync failed: ${error.message}`, 500);
  }
};
