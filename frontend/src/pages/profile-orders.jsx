import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBox, FaArrowLeft, FaCheck, FaClock, FaTruck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const orders = user.orders || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FaCheck className="text-green-500" />;
      case 'processing':
        return <FaClock className="text-blue-500" />;
      case 'shipped':
        return <FaTruck className="text-orange-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      <Head>
        <title>My Orders - IndiBuy</title>
        <meta name="description" content="View your order history on IndiBuy" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Link href="/profile" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium">
                <FaArrowLeft /> Back to Profile
              </Link>
              <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">Track and manage your purchases</p>
            </motion.div>

            {orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Order ID</p>
                          <h3 className="text-xl font-bold text-gray-900 font-mono">{order.orderId}</h3>
                        </div>
                        <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                        </div>
                      </div>
                      <div className="flex items-center gap-8 mt-4 text-sm text-gray-600">
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="font-semibold text-gray-900">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="font-bold text-gray-900 text-lg">₹{order.total?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Payment</p>
                          <p className="font-semibold text-gray-900">{order.paymentMethod || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Items ({order.items?.length || 0})</h4>
                      <div className="space-y-3">
                        {order.items && order.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="p-6 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Shipping Address</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-900">{order.address?.address}</p>
                        <p className="text-gray-900">{order.address?.city}, {order.address?.state} {order.address?.pincode}</p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="p-6 bg-gray-50">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">₹{(order.total * 0.846).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax (18% GST)</span>
                          <span className="font-semibold">₹{(order.total * 0.153).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="font-bold text-gray-900">Total</span>
                          <span className="font-bold text-lg text-green-600">₹{order.total?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow p-12 text-center"
              >
                <FaBox size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                <Link href="/products">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                    Shop Now
                  </button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
