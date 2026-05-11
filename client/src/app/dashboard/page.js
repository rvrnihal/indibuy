'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaBox, FaHeart, FaMapMarkerAlt, FaWallet, FaSignOutAlt, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch user profile
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        // Simulate orders
        setOrders([
          {
            _id: '1',
            orderNumber: 'ORD-123456',
            date: '2024-01-15',
            total: 5800,
            status: 'Delivered',
            items: 3
          },
          {
            _id: '2',
            orderNumber: 'ORD-123457',
            date: '2024-01-10',
            total: 2500,
            status: 'In Transit',
            items: 1
          }
        ]);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error(error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out successfully');
    router.push('/');
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

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">IndiBuy</Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-center mb-1 dark:text-white">{user?.name || 'User'}</h2>
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm capitalize mb-4">
                {user?.role} Account
              </p>

              {/* Quick Stats */}
              <div className="space-y-2 pt-4 border-t dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Orders</span>
                  <span className="font-bold dark:text-white">{orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Wallet Balance</span>
                  <span className="font-bold dark:text-white">₹0</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: FaUser },
                { id: 'orders', label: 'Orders', icon: FaBox },
                { id: 'wishlist', label: 'Wishlist', icon: FaHeart },
                { id: 'addresses', label: 'Addresses', icon: FaMapMarkerAlt },
                { id: 'wallet', label: 'Wallet', icon: FaWallet }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="text-lg" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </motion.aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow p-8">
                  <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                  <p className="text-blue-100">Manage your account and track your orders</p>
                </div>

                {/* Quick Access */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Orders', value: orders.length, icon: FaBox },
                    { label: 'Wishlist Items', value: 5, icon: FaHeart },
                    { label: 'Addresses', value: 2, icon: FaMapMarkerAlt },
                    { label: 'Wallet Balance', value: '₹0', icon: FaWallet }
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                        <Icon className="text-2xl text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold dark:text-white">Recent Orders</h2>
                    <Link href="#orders" className="text-blue-600 hover:underline text-sm">View All</Link>
                  </div>
                  <div className="divide-y dark:divide-gray-700">
                    {orders.map(order => (
                      <div key={order._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold dark:text-white">{order.orderNumber}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.date} • {order.items} item(s)
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold dark:text-white">₹{order.total}</p>
                            <p className={`text-sm font-semibold ${
                              order.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {order.status}
                            </p>
                          </div>
                          <FaChevronRight className="text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
              >
                <div className="p-6 border-b dark:border-gray-700">
                  <h2 className="text-xl font-bold dark:text-white">My Orders</h2>
                </div>
                <div className="divide-y dark:divide-gray-700">
                  {orders.map(order => (
                    <div key={order._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-lg dark:text-white">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{order.date}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{order.items} item(s) • Total: ₹{order.total}</p>
                      <button className="text-blue-600 hover:underline text-sm font-semibold">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center"
              >
                <FaHeart className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No items in your wishlist yet</p>
                <Link href="/products" className="text-blue-600 hover:underline font-semibold">
                  Start exploring
                </Link>
              </motion.div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-4 dark:text-white">My Addresses</h2>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <FaMapMarkerAlt className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No addresses saved yet</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                      Add New Address
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Wallet Tab */}
            {activeTab === 'wallet' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 text-center mb-6">
                  <p className="text-blue-100 mb-2">Wallet Balance</p>
                  <h2 className="text-4xl font-bold">₹0</h2>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">
                  Add Money to Wallet
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
