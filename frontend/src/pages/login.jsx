import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    const result = login(formData.email, formData.password);
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const demoLogin = () => {
    setFormData({
      email: 'demo@example.com',
      password: 'demo123'
    });
  };

  return (
    <>
      <Head>
        <title>Login - IndiBuy</title>
        <meta name="description" content="Login to your IndiBuy account" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20 pb-10">
          <div className="max-w-md mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Login to your IndiBuy account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaLock className="inline mr-2" />
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? 'Logging in...' : (
                    <>
                      Login
                      <FaArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <p className="text-sm text-gray-600 mb-2"><strong>Demo account:</strong></p>
                <p className="text-sm text-gray-600 mb-1">Email: <code className="bg-blue-100 px-2 py-1 rounded text-xs">demo@example.com</code></p>
                <p className="text-sm text-gray-600 mb-3">Password: <code className="bg-blue-100 px-2 py-1 rounded text-xs">demo123</code></p>
                <button
                  type="button"
                  onClick={demoLogin}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Use demo credentials
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-center text-gray-600"
              >
                <p>
                  Don't have an account?{' '}
                  <Link href="/register">
                    <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                      Sign up
                    </span>
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
}
