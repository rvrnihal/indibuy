import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUser, FaBox, FaMapMarkerAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProfileDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    { icon: FaUser, label: 'Profile Info', href: '/profile', active: true },
    { icon: FaBox, label: 'My Orders', href: '/profile-orders' },
    { icon: FaMapMarkerAlt, label: 'Addresses', href: '/profile-addresses' },
    { icon: FaCog, label: 'Settings', href: '/profile-settings' }
  ];

  return (
    <>
      <Head>
        <title>My Profile - IndiBuy</title>
        <meta name="description" content="Manage your IndiBuy account and orders" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">Manage your account and orders</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Menu */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
                      <FaUser size={32} className="text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">{user.name || 'User'}</h2>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>

                  <nav className="space-y-2">
                    {menuItems.map((item, idx) => (
                      <Link key={idx} href={item.href}>
                        <motion.button
                          whileHover={{ x: 5 }}
                          className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition ${
                            item.active
                              ? 'bg-blue-100 text-blue-600 font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <item.icon size={18} />
                          {item.label}
                        </motion.button>
                      </Link>
                    ))}
                  </nav>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleLogout}
                    className="w-full mt-6 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition flex items-center gap-2 justify-center border border-red-200"
                  >
                    <FaSignOutAlt size={16} /> Logout
                  </motion.button>
                </div>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-3 space-y-6"
              >
                {/* Profile Info Card */}
                <div className="bg-white rounded-lg shadow p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{user.name || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                      <p className="px-4 py-3 bg-green-50 rounded-lg text-green-700 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> Active
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </motion.button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white"
                  >
                    <p className="text-sm font-medium opacity-90">Total Orders</p>
                    <p className="text-3xl font-bold mt-2">{user.orders ? user.orders.length : 0}</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white"
                  >
                    <p className="text-sm font-medium opacity-90">Saved Addresses</p>
                    <p className="text-3xl font-bold mt-2">{user.addresses ? user.addresses.length : 0}</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white"
                  >
                    <p className="text-sm font-medium opacity-90">Items in Cart</p>
                    <p className="text-3xl font-bold mt-2">{cart.length}</p>
                  </motion.div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
                  
                  {user.orders && user.orders.length > 0 ? (
                    <div className="space-y-4">
                      {user.orders.slice(0, 3).map((order, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">{order.orderId}</p>
                            <p className="text-sm text-gray-600">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">₹{order.total?.toLocaleString() || 0}</p>
                            <p className={`text-sm font-semibold ${
                              order.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {order.status || 'Pending'}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      <Link href="/profile-orders">
                        <button className="w-full mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition border border-blue-200">
                          View All Orders
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">No orders yet. <Link href="/products" className="text-blue-600 font-semibold">Start shopping!</Link></p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
