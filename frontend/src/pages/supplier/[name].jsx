import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { allProducts, getProductsByVendor } from '../../utils/products';
import suppliers from '../../utils/suppliers.json';

export default function SupplierPage() {
  const router = useRouter();
  const { name } = router.query;

  if (!name) return null;

  const displayName = decodeURIComponent(name);
  const supplierProducts = getProductsByVendor(displayName);
  const supplierMeta = suppliers[displayName] || {
    address: 'Contact for details',
    city: 'India',
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23808080" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="white" text-anchor="middle" dy=".3em" font-weight="bold"%3E?%3C/text%3E%3C/svg%3E',
    rating: 4.3,
    reviews: 45,
    phone: 'N/A'
  };

  return (
    <>
      <Head>
        <title>{displayName} - Supplier - IndiBuy</title>
        <meta name="description" content={`Products from ${displayName}`} />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <img src={supplierMeta.logo} alt={displayName} className="w-16 h-16 rounded-lg" />
                <div>
                  <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
                  <p className="text-gray-600">Verified supplier on IndiBuy • {supplierMeta.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={16} fill={i < Math.floor(supplierMeta.rating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <div className="text-sm text-gray-600">{supplierMeta.rating} ({supplierMeta.reviews} reviews)</div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2 bg-white rounded-lg p-6 shadow">
                <h2 className="text-xl font-semibold mb-4">Products ({supplierProducts.length})</h2>
                {supplierProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {supplierProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg overflow-hidden bg-white hover:shadow transition">
                        <div className="flex">
                          <img src={product.image} alt={product.name} className="w-32 h-24 object-cover" />
                          <div className="p-3 flex-1">
                            <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-gray-700 font-bold">₹{product.price.toLocaleString()}</span>
                              <Link href={`/product/${product.id}`} className="text-blue-600 hover:underline text-xs">View</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No products listed by this supplier yet.</p>
                )}
              </div>

              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="font-semibold mb-4">Supplier Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">Address</p>
                    <p className="text-gray-700">{supplierMeta.address}</p>
                    <p className="text-gray-700">{supplierMeta.city}, {supplierMeta.state} {supplierMeta.zip}</p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-gray-600 font-medium">Contact</p>
                    <p className="text-gray-700">{supplierMeta.phone}</p>
                    <p className="text-gray-700 break-all">{supplierMeta.email}</p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-gray-600 font-medium">Established</p>
                    <p className="text-gray-700">{supplierMeta.established}</p>
                  </div>
                </div>
              </div>
            </div>

            <Link href={`/supplier/${encodeURIComponent(displayName)}/products`} className="text-blue-600 hover:underline">
              View Full Profile →
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}
