import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCog, FaArrowLeft, FaBell, FaShieldAlt, FaEye } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    twoFactorAuth: false,
    privateProfile: false
  });
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const settingGroups = [
    {
      title: 'Notifications',
      icon: FaBell,
      color: 'text-blue-600',
      items: [
        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
        { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about your orders' },
        { key: 'promotions', label: 'Promotional Emails', desc: 'Receive latest deals and offers' }
      ]
    },
    {
      title: 'Security',
      icon: FaShieldAlt,
      color: 'text-green-600',
      items: [
        { key: 'twoFactorAuth', label: 'Two-Factor Authentication', desc: 'Add extra security to your account' }
      ]
    },
    {
      title: 'Privacy',
      icon: FaEye,
      color: 'text-purple-600',
      items: [
        { key: 'privateProfile', label: 'Private Profile', desc: 'Hide your profile from other users' }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Settings - IndiBuy</title>
        <meta name="description" content="Manage your account settings on IndiBuy" />
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
              <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account preferences</p>
            </motion.div>

            {/* Save Notification */}
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium"
              >
                ✓ Settings saved successfully
              </motion.div>
            )}

            {/* Settings Groups */}
            <div className="space-y-6">
              {settingGroups.map((group, groupIdx) => (
                <motion.div
                  key={groupIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIdx * 0.1 }}
                  className="bg-white rounded-lg shadow p-6"
                >
                  {/* Group Header */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <div className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center ${group.color}`}>
                      <group.icon size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{group.title}</h2>
                  </div>

                  {/* Settings Items */}
                  <div className="space-y-4">
                    {group.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.label}</h3>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => handleToggle(item.key)}
                          className={`relative w-12 h-6 rounded-full transition ${
                            settings[item.key] ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <motion.div
                            layout
                            className="absolute w-5 h-5 bg-white rounded-full top-0.5"
                            animate={{
                              x: settings[item.key] ? 24 : 2
                            }}
                            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6 mt-6 border-l-4 border-red-500"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Danger Zone</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <h3 className="font-semibold text-red-900">Delete Account</h3>
                    <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={handleSave}
              className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition w-full sm:w-auto"
            >
              Save Changes
            </motion.button>
          </div>
        </div>
      </Layout>
    </>
  );
}
