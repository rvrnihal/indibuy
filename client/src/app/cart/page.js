'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      // Simulating cart fetch
      setCartItems([
        {
          _id: '1',
          name: 'Industrial Drill',
          price: 5000,
          quantity: 2,
          image: '',
          vendor: 'Tech Supplies Co'
        },
        {
          _id: '2',
          name: 'Safety Helmet',
          price: 800,
          quantity: 1,
          image: '',
          vendor: 'Safety First Ltd'
        }
      ]);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(items =>
      items.map(item => item._id === id ? { ...item, quantity } : item)
    );
  };

  const removeFromCart = (id) => {
    setCartItems(items => items.filter(item => item._id !== id));
    toast.success('Item removed from cart');
  };

  const applyCoupon = () => {
    if (coupon.trim()) {
      toast.success(`Coupon "${coupon}" applied!`);
      setCoupon('');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 500 ? 0 : 100;
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">IndiBuy</Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <FaShoppingBag className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Sold by: {item.vendor}
                      </p>
                      <p className="text-blue-600 font-bold">₹{item.price}</p>
                    </div>

                    {/* Quantity and Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-600 hover:text-red-700 mb-2"
                      >
                        <FaTrash />
                      </button>
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-2 py-1"
                        >
                          <FaMinus className="text-sm" />
                        </button>
                        <span className="px-4 py-1 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-2 py-1"
                        >
                          <FaPlus className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                <h2 className="text-lg font-bold dark:text-white">Order Summary</h2>

                {/* Coupon */}
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-white">Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 pt-4 border-t dark:border-gray-700">
                  <div className="flex justify-between dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between dark:text-gray-300">
                    <span>Tax (18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between dark:text-gray-300">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold pt-4 border-t dark:border-gray-700 dark:text-white">
                  <span>Total</span>
                  <span className="text-blue-600">₹{total.toLocaleString()}</span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/products"
                  className="block w-full text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Safe Shopping Badge */}
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mt-4 text-sm text-gray-700 dark:text-blue-100">
                <p className="font-semibold mb-2">✓ Safe Shopping</p>
                <ul className="space-y-1 text-xs">
                  <li>• 30-day returns</li>
                  <li>• Secure payments</li>
                  <li>• Verified sellers</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
