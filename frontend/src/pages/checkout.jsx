import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaCheckCircle, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { allProducts } from '../utils/products';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartSummary, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const [step, setStep] = useState('shipping');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutSummary, setCheckoutSummary] = useState({ subtotal: 0, tax: 0, total: 0, delivery: 0 });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  useEffect(() => {
    if (router.isReady) {
      const { productId, quantity } = router.query;
      if (productId) {
        const prodId = parseInt(productId);
        const prod = allProducts.find(p => p.id === prodId);
        if (prod) {
          const qty = parseInt(quantity) || 1;
          const sub = prod.price * qty;
          const tx = Math.round(sub * 0.18);
          const tot = sub + tx;
          setCheckoutItems([{
            id: prod.id,
            name: prod.name,
            price: prod.price,
            quantity: qty
          }]);
          setCheckoutSummary({
            subtotal: sub,
            tax: tx,
            total: tot,
            delivery: 0
          });
        }
      } else {
        setCheckoutItems(cart);
        const sum = getCartSummary(cart);
        setCheckoutSummary({
          subtotal: sum.subtotal,
          tax: sum.tax,
          total: sum.total,
          delivery: sum.delivery
        });
      }
    }
  }, [router.isReady, router.query, cart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateShipping = () => {
    if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
      alert('Please fill in all address fields');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateShipping()) return;
    
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const newOrder = {
        orderId: 'ORD-' + Date.now(),
        items: checkoutItems,
        total: checkoutSummary.total,
        address: formData,
        paymentMethod,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      addOrder(newOrder);
      setOrderId(newOrder.orderId);
      setOrderPlaced(true);
      if (!router.query.productId) {
        clearCart();
      }
      setIsProcessing(false);
    }, 2000);
  };

  const summary = checkoutSummary;

  const paymentMethods = [
    { id: 'razorpay', name: 'Razorpay', icon: '💳' },
    { id: 'gpay', name: 'Google Pay', icon: '📱' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦' },
    { id: 'upi', name: 'UPI', icon: '📲' }
  ];

  if (orderPlaced) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 pb-10">
          <div className="max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-lg p-8 text-center"
            >
              <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">Your order has been placed successfully</p>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-2xl font-bold text-green-600">{orderId}</p>
              </div>

              <div className="space-y-2 mb-8 text-left">
                <p><strong>Items:</strong> {checkoutItems.length} product(s)</p>
                <p><strong>Total Amount:</strong> ₹{summary.total.toLocaleString()}</p>
                <p><strong>Payment Method:</strong> {paymentMethod || 'Not specified'}</p>
              </div>

              <div className="flex gap-4">
                <Link href="/products" className="flex-1">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!router.isReady) {
    return null;
  }

  if (checkoutItems.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 pb-10">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
            <Link href="/products">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2">
                <FaArrowLeft /> Back to Shopping
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your order securely</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Section */}
            <div className="lg:col-span-2">
              {/* Step Indicator */}
              <div className="mb-8 bg-white rounded-lg p-6 shadow">
                <div className="flex items-center justify-between">
                  <div className={`text-center ${step === 'shipping' ? 'text-blue-600' : 'text-green-600'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold ${
                      step === 'shipping' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {step !== 'shipping' ? '✓' : '1'}
                    </div>
                    <p className="text-sm font-semibold">Shipping</p>
                  </div>
                  <div className={`flex-1 h-1 mx-4 ${step !== 'shipping' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <div className={`text-center ${step === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold ${
                      step === 'payment' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      2
                    </div>
                    <p className="text-sm font-semibold">Payment</p>
                  </div>
                </div>
              </div>

              {/* Shipping Form */}
              {step === 'shipping' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg p-6 shadow mb-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="address"
                      placeholder="Street Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setStep('payment')}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mt-4"
                    >
                      Continue to Payment
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Payment Methods */}
              {step === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg p-6 shadow"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Select Payment Method</h2>
                  
                  <p className="text-gray-600 text-sm mb-6">Choose your preferred payment method. All transactions are secure and encrypted.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {paymentMethods.map(method => (
                      <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 border-2 rounded-lg transition text-left ${
                          paymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-2xl mb-2">{method.icon}</div>
                            <h3 className="font-bold text-gray-900">{method.name}</h3>
                          </div>
                          {paymentMethod === method.id && (
                            <FaCheckCircle className="text-blue-600" size={24} />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    disabled={!paymentMethod || isProcessing}
                    onClick={handlePlaceOrder}
                    className={`w-full py-3 rounded-lg font-bold transition ${
                      paymentMethod && !isProcessing
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </motion.button>

                  <button
                    onClick={() => setStep('shipping')}
                    className="w-full mt-3 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Back to Shipping
                  </button>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg p-6 shadow h-fit"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 pb-4 border-b">
                {checkoutItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="py-4 space-y-2 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{summary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="text-gray-900">₹{summary.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-gray-900">₹{summary.delivery.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t-2">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-green-600">₹{summary.total.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
