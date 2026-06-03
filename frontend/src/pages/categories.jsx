import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  'Steel & Iron',
  'Machinery',
  'Tools',
  'Electrical',
  'Plumbing',
  'Construction'
];

export default function CategoriesPage() {
  return (
    <>
      <Head>
        <title>Categories - IndiBuy</title>
        <meta name="description" content="Browse categories on IndiBuy" />
      </Head>
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl font-bold mb-4">Categories</h1>
              <p className="text-gray-600 mb-6">Browse products by category</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <motion.div
                  key={cat}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold mb-2">{cat}</h3>
                  <p className="text-sm text-gray-500 mb-4">Explore {cat} products and suppliers.</p>
                  <Link href={`/category/${encodeURIComponent(cat)}`}>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">View {cat}</button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
