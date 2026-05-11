'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600">IndiBuy</Link>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome Back</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-white">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-white">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <span className="dark:text-white">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <FaGoogle className="text-red-600" /> Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <FaGithub /> GitHub
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
