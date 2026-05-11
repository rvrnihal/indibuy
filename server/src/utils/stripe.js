import Stripe from 'stripe';
import Order from '../models/Order.js';
import Transaction from '../models/Transaction.js';
import AppError from '../middleware/errorHandler.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Payment Intent
export const createStripePaymentIntent = async (orderId, amount, currency = 'inr', email) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency,
      metadata: {
        orderId,
        email
      },
      receipt_email: email
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      currency,
      status: paymentIntent.status
    };
  } catch (error) {
    throw new AppError(`Stripe payment intent creation failed: ${error.message}`, 500);
  }
};

// Retrieve Payment Intent
export const retrieveStripePaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      status: paymentIntent.status,
      charges: paymentIntent.charges.data,
      metadata: paymentIntent.metadata
    };
  } catch (error) {
    throw new AppError(`Failed to retrieve payment intent: ${error.message}`, 500);
  }
};

// Confirm Stripe Payment
export const confirmStripePayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const charge = paymentIntent.charges.data[0];
      
      return {
        success: true,
        paymentId: charge.id,
        amount: charge.amount / 100,
        status: 'completed',
        receipt_url: charge.receipt_url,
        metadata: paymentIntent.metadata
      };
    } else if (paymentIntent.status === 'requires_action') {
      throw new AppError('Payment requires additional action', 400);
    } else {
      throw new AppError(`Payment failed: ${paymentIntent.status}`, 400);
    }
  } catch (error) {
    throw new AppError(`Payment confirmation failed: ${error.message}`, 400);
  }
};

// Handle Stripe Webhook
export const handleStripeWebhook = async (event) => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Update order status
        const order = await Order.findOne({ 'payment.transactionId': paymentIntent.id });
        if (order) {
          order.payment.status = 'completed';
          order.status = 'confirmed';
          await order.save();
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('Payment failed:', paymentIntent.id);
        
        // Update order status
        const order = await Order.findOne({ 'payment.transactionId': paymentIntent.id });
        if (order) {
          order.payment.status = 'failed';
          order.status = 'cancelled';
          await order.save();
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        console.log('Charge refunded:', charge.id);
        
        // Update order status
        const order = await Order.findOne({ 'payment.transactionId': charge.payment_intent });
        if (order) {
          order.status = 'refunded';
          order.payment.status = 'refunded';
          await order.save();
        }
        break;
      }

      case 'customer.subscription.deleted': {
        console.log('Subscription deleted');
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { success: true };
  } catch (error) {
    throw new AppError(`Webhook processing failed: ${error.message}`, 500);
  }
};

// Create Refund
export const createStripeRefund = async (chargeId, amount, reason) => {
  try {
    const refund = await stripe.refunds.create({
      charge: chargeId,
      amount: amount ? Math.round(amount * 100) : undefined,
      metadata: { reason }
    });

    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
      reason: refund.reason
    };
  } catch (error) {
    throw new AppError(`Stripe refund creation failed: ${error.message}`, 500);
  }
};

// Create Customer
export const createStripeCustomer = async (email, name, metadata = {}) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata
    });

    return {
      success: true,
      customerId: customer.id,
      email: customer.email,
      name: customer.name
    };
  } catch (error) {
    throw new AppError(`Stripe customer creation failed: ${error.message}`, 500);
  }
};

// Create Setup Intent (for saving cards)
export const createStripeSetupIntent = async (customerId) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card']
    });

    return {
      success: true,
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id
    };
  } catch (error) {
    throw new AppError(`Setup intent creation failed: ${error.message}`, 500);
  }
};

// List Customer Payment Methods
export const listCustomerPaymentMethods = async (customerId) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    });

    return {
      success: true,
      paymentMethods: paymentMethods.data.map(pm => ({
        id: pm.id,
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year
      }))
    };
  } catch (error) {
    throw new AppError(`Failed to list payment methods: ${error.message}`, 500);
  }
};

// Detach Payment Method
export const detachStripePaymentMethod = async (paymentMethodId) => {
  try {
    await stripe.paymentMethods.detach(paymentMethodId);

    return { success: true };
  } catch (error) {
    throw new AppError(`Failed to detach payment method: ${error.message}`, 500);
  }
};

// Get Charge Details
export const getStripeChargeDetails = async (chargeId) => {
  try {
    const charge = await stripe.charges.retrieve(chargeId);

    return {
      success: true,
      chargeId: charge.id,
      amount: charge.amount / 100,
      currency: charge.currency.toUpperCase(),
      status: charge.status,
      paid: charge.paid,
      refunded: charge.refunded,
      refunds: charge.refunds.data,
      receiptUrl: charge.receipt_url
    };
  } catch (error) {
    throw new AppError(`Failed to retrieve charge details: ${error.message}`, 500);
  }
};
