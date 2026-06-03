import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaTrash, FaShoppingBag, FaMinus, FaPlus } from 'react-icons/fa';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeItem, updateQuantity, getCartSummary } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const summary = getCartSummary(cart);

  const handleQuantityChange = (productId, newQty) => {
    if (newQty > 0) {
      updateQuantity(productId, newQty);
    }
  };

  const handleApplyPromo = () => {
    if (promoCode === 'INDIBUY10') {
      setDiscount(Math.round(summary.subtotal * 0.1));
    } else if (promoCode === 'NEWBUY20') {
      setDiscount(Math.round(summary.subtotal * 0.2));
    } else {
      setDiscount(0);
      alert('Invalid promo code');
    }
  };

  const finalTotal = Math.max(0, summary.total + discount);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  return (
    <>
      <Head>
        <title>Shopping Cart - IndiBuy</title>
        <meta name="description" content="Review your shopping cart items" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 pb-10">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white rounded-lg shadow"
              >
                <FaShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Add some products to get started!</p>
                <Link href="/products">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
                    Continue Shopping
                  </button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-lg shadow p-4 flex gap-4"
                    >
                      <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-sm text-gray-600 text-center">Image</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">ID: {item.id}</p>
                        <p className="text-green-600 font-semibold">₹{item.price}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </motion.button>
                        <div className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                        <p className="font-bold text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow p-6 sticky top-24 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                    
                    <div className="space-y-2 border-b pb-4">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>₹{summary.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>GST (18%):</span>
                        <span>₹{summary.tax.toLocaleString()}</span>
                      </div>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold border-b pb-4">
                        <span>Discount:</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-2xl font-bold text-gray-900 bg-green-50 p-3 rounded">
                      <span>Total:</span>
                      <span>₹{finalTotal.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleApplyPromo}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg text-sm"
                      >
                        Apply Promo
                      </motion.button>
                      <p className="text-xs text-gray-500 text-center">Try: INDIBUY10 or NEWBUY20</p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mt-6"
                    >
                      Proceed to Checkout
                    </motion.button>

                    <Link href="/products">
                      <button className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 rounded-lg">
                        Continue Shopping
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
