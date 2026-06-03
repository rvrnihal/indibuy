import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function AddressesPage() {
  const router = useRouter();
  const { user, updateUserAddresses } = useAuth();
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
      alert('Please fill in all fields');
      return;
    }
    const newAddresses = [...addresses, { ...formData, id: Date.now() }];
    setAddresses(newAddresses);
    setFormData({ address: '', city: '', state: '', pincode: '' });
    setShowForm(false);
  };

  const handleRemoveAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <>
      <Head>
        <title>My Addresses - IndiBuy</title>
        <meta name="description" content="Manage your delivery addresses on IndiBuy" />
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
              <h1 className="text-4xl font-bold text-gray-900">Saved Addresses</h1>
              <p className="text-gray-600 mt-2">Manage your delivery addresses</p>
            </motion.div>

            {/* Add Address Button */}
            {!showForm && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowForm(true)}
                className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FaPlus /> Add New Address
              </motion.button>
            )}

            {/* Add Address Form */}
            {showForm && (
              <motion.form
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleAddAddress}
                className="bg-white rounded-lg shadow p-6 mb-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Address</h3>
                
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

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Save Address
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.form>
            )}

            {/* Addresses List */}
            {addresses && addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr, idx) => (
                  <motion.div
                    key={addr.id || idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-lg shadow p-6 relative"
                  >
                    <button
                      onClick={() => handleRemoveAddress(addr.id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <FaTrash size={16} />
                    </button>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{addr.address}</h3>
                        <p className="text-gray-600">{addr.city}, {addr.state} {addr.pincode}</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="mt-3 px-4 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-semibold transition"
                        >
                          Use for Delivery
                        </motion.button>
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
                <FaMapMarkerAlt size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Addresses Saved</h3>
                <p className="text-gray-600 mb-6">Add your first delivery address</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
                >
                  <FaPlus /> Add Address
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
