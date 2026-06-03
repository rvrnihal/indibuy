import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const categories = [
    { id: 1, name: 'Steel & Iron', icon: '🏭' },
    { id: 2, name: 'Machinery', icon: '⚙️' },
    { id: 3, name: 'Tools', icon: '🔧' },
    { id: 4, name: 'Electrical', icon: '⚡' },
    { id: 5, name: 'Plumbing', icon: '🔧' },
    { id: 6, name: 'Construction', icon: '🏗️' },
  ];

  const features = [
    {
      title: 'Verified Vendors',
      description: 'Access only verified and trusted industrial suppliers',
      icon: '✓'
    },
    {
      title: 'Bulk Ordering',
      description: 'Place large orders with competitive pricing',
      icon: '📦'
    },
    {
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery to your location',
      icon: '🚚'
    },
    {
      title: 'Secure Payments',
      description: 'Multiple payment options with buyer protection',
      icon: '💳'
    },
  ];

  return (
    <>
      <Head>
        <title>IndiBuy - Industrial B2B E-Commerce Platform</title>
        <meta name="description" content="Buy and sell industrial products on India's leading B2B marketplace" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <Hero />

        {/* Categories Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-600 mt-2">Find what you need across our diverse product categories</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/category/${category.name}`}>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 text-center hover:shadow-lg transition">
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900">Why Choose IndiBuy?</h2>
              <p className="text-gray-600 mt-2">Experience the best B2B marketplace for industrial products</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 hover:shadow-lg transition"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to transform your business?
              </h2>
              <p className="text-blue-100 mb-8 text-lg">
                Join thousands of industrial buyers and suppliers on IndiBuy
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register?role=buyer"
                  className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:shadow-lg transition font-semibold"
                >
                  Sign Up as Buyer
                </Link>
                <Link
                  href="/register?role=vendor"
                  className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:bg-opacity-10 transition font-semibold"
                >
                  Become a Vendor
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
}
