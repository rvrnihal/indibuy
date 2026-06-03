import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';

const suppliers = [
  { name: 'Steel Enterprises', city: 'Mumbai' },
  { name: 'Steel Corp', city: 'Pune' },
  { name: 'Sheet Steel Ltd', city: 'Ahmedabad' },
  { name: 'Iron Works', city: 'Hyderabad' },
  { name: 'Pipe Industries', city: 'Surat' },
  { name: 'Industrial Works', city: 'Chennai' },
  { name: 'CNC Industries', city: 'Bengaluru' },
  { name: 'Conveyor Tech', city: 'Pune' },
  { name: 'Pump Solutions', city: 'Coimbatore' },
  { name: 'Air Systems', city: 'Vadodara' },
  { name: 'Tool Masters', city: 'Delhi' },
  { name: 'Test Instruments', city: 'Mumbai' },
  { name: 'Power Tools Co', city: 'Delhi' },
  { name: 'Tool Factory', city: 'Gujarat' },
  { name: 'Power Solutions', city: 'Kolkata' },
  { name: 'Motor Solutions', city: 'Chennai' },
  { name: 'Solar Energy Ltd', city: 'Jaipur' },
  { name: 'Light Solutions', city: 'Bengaluru' },
  { name: 'Plumbing Works', city: 'Surat' },
  { name: 'Tank Industries', city: 'Pune' },
  { name: 'Construction Equipment', city: 'Delhi' },
  { name: 'Scaffold Pro', city: 'Mumbai' }
];

export default function SuppliersPage() {
  return (
    <>
      <Head>
        <title>Suppliers - IndiBuy</title>
        <meta name="description" content="Find suppliers on IndiBuy" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl font-bold mb-4">Suppliers</h1>
              <p className="text-gray-600 mb-6">Verified suppliers and manufacturers on IndiBuy</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((s) => (
                <motion.div whileHover={{ y: -4 }} key={s.name} className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold mb-1">{s.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{s.city}</p>
                  <div className="flex gap-2">
                    <Link href={`/supplier/${encodeURIComponent(s.name)}`} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">View Products</Link>
                    <a href={`mailto:info@${s.name.replace(/\s+/g, '').toLowerCase()}.com`} className="px-3 py-1 border rounded text-sm">Contact</a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
