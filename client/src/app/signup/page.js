'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'buyer', label: 'Buyer', icon: '🛒' },
    { value: 'vendor', label: 'Vendor', icon: '🏪' },
    { value: 'contractor', label: 'Contractor', icon: '🔨' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Valid email is required');
      return false;
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      toast.error('Valid 10-digit phone number is required');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (!formData.agreeToTerms) {
      toast.error('You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
      return;
    }

    if (!validateStep2()) return;

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        toast.success('Account created successfully!');
        router.push('/dashboard');
      } else {
        toast.error(data.message || 'Signup failed');
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
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {step === 1 ? 'Create Account' : 'Security & Role'}
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex-1 h-2 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  maxLength="10"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Password */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-400"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3 dark:text-white">Account Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map(role => (
                    <label
                      key={role.value}
                      className={`p-3 border-2 rounded-lg cursor-pointer text-center transition ${
                        formData.role === role.value
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className="text-2xl">{role.icon}</span>
                      <p className="text-xs font-semibold mt-1 dark:text-white">{role.label}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 text-sm dark:text-white">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1"
                />
                <span>
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms & Conditions
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition`}
            >
              {loading ? 'Creating...' : step === 1 ? 'Next' : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">Or sign up with</span>
          </div>
        </div>

        {/* Social Signup */}
        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <FaGoogle className="text-red-600" />
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <FaGithub />
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
