'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBox, FaCheckCircle, FaTruck, FaHome, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      // Simulate fetching order
      setOrder({
        _id: orderId,
        orderNumber: 'ORD-123456',
        status: 'In Transit',
        items: [
          {
            _id: '1',
            name: 'Industrial Drill',
            quantity: 2,
            price: 5000,
            image: ''
          }
        ],
        shippingAddress: {
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        },
        total: 5800,
        createdAt: '2024-01-15',
        timeline: [
          { status: 'Order Placed', date: '2024-01-15', description: 'Your order has been confirmed' },
          { status: 'Processing', date: '2024-01-15', description: 'We are preparing your order' },
          { status: 'Shipped', date: '2024-01-16', description: 'Your order has been shipped' },
          { status: 'In Transit', date: '2024-01-17', description: 'Your order is on the way' },
          { status: 'Delivered', date: null, description: 'Estimated delivery: 2024-01-20' }
        ],
        deliveryPartner: {
          name: 'John Courier',
          phone: '+91 98765 43210',
          vehicle: 'Blue Van'
        },
        trackingNumber: 'TR123456789'
      });
    } catch (error) {
      toast.error('Failed to load order');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="inline-block animate-spin">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Order not found</p>
          <Link href="/orders" className="text-blue-600 hover:underline">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = order.timeline.findIndex(t => t.status === order.status);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">IndiBuy</Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Order Tracking</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1 dark:text-white">Order {order.orderNumber}</h1>
                  <p className="text-gray-600 dark:text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-2 rounded-full font-semibold">
                  {order.status}
                </span>
              </div>

              <div className="flex gap-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Tracking: <strong>{order.trackingNumber}</strong>
                </span>
                <button className="text-blue-600 hover:underline">Copy</button>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-bold mb-6 dark:text-white">Delivery Timeline</h2>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-600"></div>

                {/* Timeline Items */}
                <div className="space-y-6">
                  {order.timeline.map((item, idx) => (
                    <div key={idx} className="relative pl-16">
                      {/* Timeline Dot */}
                      <div className={`absolute left-0 w-8 h-8 rounded-full border-4 flex items-center justify-center ${
                        idx <= currentStatusIndex
                          ? 'bg-green-600 border-green-600'
                          : 'bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600'
                      }`}>
                        {idx <= currentStatusIndex && (
                          <FaCheckCircle className="text-white" />
                        )}
                      </div>

                      {/* Timeline Content */}
                      <div>
                        <h3 className="font-bold text-lg dark:text-white">{item.status}</h3>
                        {item.date && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(item.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Delivery Partner Info */}
            {order.status === 'In Transit' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                  <FaTruck className="text-blue-600" /> Your Delivery Partner
                </h2>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {order.deliveryPartner.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg dark:text-white">{order.deliveryPartner.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{order.deliveryPartner.vehicle}</p>
                    <button className="flex items-center gap-2 text-blue-600 hover:underline mt-2">
                      <FaPhone /> {order.deliveryPartner.phone}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                <FaBox /> Order Items
              </h2>

              <div className="space-y-3 mb-4 pb-4 border-b dark:border-gray-700">
                {order.items.map(item => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-semibold dark:text-white">{item.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold dark:text-white">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="text-lg font-bold dark:text-white">
                Total: ₹{order.total}
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                <FaMapMarkerAlt /> Delivery Address
              </h2>

              <p className="dark:text-gray-300 mb-3">
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                {order.shippingAddress.zipCode}
              </p>

              <button className="w-full text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-semibold">
                Change Address
              </button>
            </motion.div>

            {/* Help */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6"
            >
              <h3 className="font-bold mb-2 text-blue-900 dark:text-blue-100">Need Help?</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                Have questions about your order?
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                Contact Support
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
