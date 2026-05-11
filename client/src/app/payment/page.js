'use client';

import { useState, useEffect } from 'react';
import { loadScript } from '@/lib/utils';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentPage() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    
    if (orderId) {
      fetchOrder(orderId);
    }
  }, []);

  const fetchOrder = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data.data);
    } catch (err) {
      setError('Failed to load order');
    }
  };

  // Razorpay Payment Handler
  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Load Razorpay script
      const script = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!script) {
        throw new Error('Failed to load Razorpay');
      }

      // Create payment order
      const orderRes = await api.post('/payments/create-order', {
        orderId: order._id,
        amount: order.totalAmount,
        currency: 'INR'
      });

      const { razorpayOrderId } = orderRes.data.data;

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.totalAmount * 100,
        currency: 'INR',
        name: 'IndiBuy',
        description: `Order ${order.orderNumber}`,
        image: 'https://your-logo-url.com/logo.png',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyRes = await api.post('/payments/verify', {
              orderId: order._id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              setSuccess(true);
              setTimeout(() => {
                router.push(`/orders/${order._id}?status=success`);
              }, 2000);
            }
          } catch (err) {
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: order.buyer?.firstName,
          email: order.buyer?.email,
          contact: order.buyer?.phone
        },
        theme: {
          color: '#3b82f6'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Payment initialization failed');
      setLoading(false);
    }
  };

  // Stripe Payment Handler
  const handleStripePayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Load Stripe script
      const script = await loadScript('https://js.stripe.com/v3/');
      if (!script) {
        throw new Error('Failed to load Stripe');
      }

      // Create payment intent
      const intentRes = await api.post('/payments/stripe/create-intent', {
        orderId: order._id,
        amount: order.totalAmount,
        email: order.buyer?.email
      });

      const { clientSecret, paymentIntentId } = intentRes.data.data;

      // Initialize Stripe
      const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      const elements = stripe.elements();
      const cardElement = elements.create('card');
      
      // Mount card element (you would need an element in the DOM)
      // cardElement.mount('#card-element');

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: order.buyer?.firstName,
            email: order.buyer?.email
          }
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === 'succeeded') {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/orders/${order._id}?status=success`);
        }, 2000);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message || 'Payment failed');
      setLoading(false);
    }
  };

  // Unified Payment Handler
  const handlePayment = async () => {
    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else if (paymentMethod === 'stripe') {
      await handleStripePayment();
    } else if (paymentMethod === 'cod') {
      try {
        setLoading(true);
        // For COD, just update order status
        await api.put(`/orders/${order._id}`, { status: 'confirmed' });
        setSuccess(true);
        setTimeout(() => {
          router.push(`/orders/${order._id}?status=success`);
        }, 2000);
      } catch (err) {
        setError('Failed to place order');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!order) {
    return <div className="flex items-center justify-center min-h-screen">Loading order...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <h1 className="text-2xl font-bold">Complete Payment</h1>
            <p className="text-blue-100 mt-2">Order #{order.orderNumber}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                ✓ Payment successful! Redirecting to order details...
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                ✕ {error}
              </div>
            )}

            {/* Order Summary */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="text-gray-900 font-medium">₹{(order.totalAmount * 0.9).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tax</span>
                  <span className="text-gray-900 font-medium">₹{(order.totalAmount * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-lg font-bold text-blue-600">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h2>
              <div className="space-y-3">
                {/* Razorpay */}
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  paymentMethod === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-900">Razorpay</p>
                    <p className="text-sm text-gray-600">Credit/Debit Card, UPI, Wallet</p>
                  </div>
                </label>

                {/* Stripe */}
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  paymentMethod === 'stripe' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-900">Stripe</p>
                    <p className="text-sm text-gray-600">International Cards & Wallets</p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when order arrives</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Link href="/cart" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition text-center">
                Back to Cart
              </Link>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay ₹${order.totalAmount}`}
              </button>
            </div>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
              <p>🔒 Your payment is secure and encrypted. We never store your card details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
