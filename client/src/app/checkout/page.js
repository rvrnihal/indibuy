'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'upi'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newOrderNumber = `ORD-${Date.now()}`;
      setOrderNumber(newOrderNumber);
      setStep(3);
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const cartItems = [
    { name: 'Industrial Drill', price: 5000, quantity: 2 },
    { name: 'Safety Helmet', price: 800, quantity: 1 }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 500 ? 0 : 100;
  const total = subtotal + tax + shipping;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">IndiBuy</Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12 max-w-2xl mx-auto">
          {[
            { num: 1, label: 'Delivery Address' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Confirmation' }
          ].map(s => (
            <div key={s.num} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                  step >= s.num
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="text-sm font-semibold text-center dark:text-white">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Address */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-600" /> Delivery Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-white">
                      Full Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your complete address"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 dark:text-white">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 dark:text-white">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 dark:text-white">Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="Zip Code"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 dark:text-white">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-6"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
                  <FaCreditCard className="text-blue-600" /> Payment Method
                </h2>

                <div className="space-y-3">
                  {[
                    { value: 'upi', label: '🔗 UPI', description: 'Google Pay, PhonePe, Paytm' },
                    { value: 'card', label: '💳 Credit/Debit Card' },
                    { value: 'netbanking', label: '🏦 Net Banking' },
                    { value: 'wallet', label: '💰 Digital Wallet' },
                    { value: 'cod', label: '📦 Cash on Delivery' }
                  ].map(method => (
                    <label
                      key={method.value}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.paymentMethod === method.value
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-semibold dark:text-white">{method.label}</p>
                          {method.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Payment Details */}
                {formData.paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center"
              >
                <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 dark:text-white">Order Confirmed!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your order has been placed successfully.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mb-6">
                  <p className="text-sm text-gray-600 dark:text-blue-200 mb-2">Order Number</p>
                  <p className="text-2xl font-bold text-blue-600">{orderNumber}</p>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You will receive a confirmation email shortly with tracking details.
                </p>

                <div className="flex gap-4">
                  <Link
                    href="/orders"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
                  >
                    View Orders
                  </Link>
                  <Link
                    href="/products"
                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4 dark:text-white">Order Summary</h2>

              <div className="space-y-2 mb-4 pb-4 border-b dark:border-gray-700">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm dark:text-gray-300">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold pt-4 border-t dark:border-gray-700 dark:text-white">
                <span>Total</span>
                <span className="text-blue-600">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
