import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { getProductsByVendor } from '../../../utils/products';
import ProductPagination from '../../../components/ProductPagination';
import suppliers from '../../../utils/suppliers.json';

export default function SupplierProducts() {
  const router = useRouter();
  const { name } = router.query;
  
  if (!name) return null;
  
  const displayName = decodeURIComponent(name);
  const supplierProducts = getProductsByVendor(displayName);
  const supplierMeta = suppliers[displayName] || {
    address: 'Contact for details',
    city: 'India',
    state: 'India',
    zip: '000000',
    logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23808080" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="white" text-anchor="middle" dy=".3em" font-weight="bold"%3E?%3C/text%3E%3C/svg%3E',
    rating: 4.3,
    reviews: 45,
    coords: [28.6139, 77.2090],
    phone: 'N/A',
    email: 'N/A',
    established: 'N/A'
  };

  return (
    <>
      <Head>
        <title>{displayName} - Profile - IndiBuy</title>
        <meta name="description" content={`Profile and products for ${displayName}`} />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <img src={supplierMeta.logo} alt={displayName} className="w-20 h-20 rounded-lg" />
                <div>
                  <h1 className="text-3xl font-bold">{displayName}</h1>
                  <p className="text-gray-600">Verified supplier on IndiBuy • {supplierMeta.city}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={16} fill={i < Math.floor(supplierMeta.rating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <div className="text-sm text-gray-600">{supplierMeta.rating} ({supplierMeta.reviews} reviews)</div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2 bg-white rounded-lg p-6 shadow">
                <h2 className="font-semibold mb-4 text-lg">Products ({supplierProducts.length})</h2>
                {supplierProducts.length > 0 ? (
                  <ProductPagination products={supplierProducts} pageSize={8} />
                ) : (
                  <p className="text-gray-600">No products from this supplier yet.</p>
                )}
              </div>

              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="font-semibold mb-4 text-lg">Supplier Details</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium mb-1">Address</p>
                    <p className="text-gray-700 text-sm">{supplierMeta.address}</p>
                    <p className="text-gray-700 text-sm">{supplierMeta.city}, {supplierMeta.state} {supplierMeta.zip}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600 font-medium mb-1">Contact</p>
                    <p className="text-gray-700 text-sm break-all">{supplierMeta.phone}</p>
                    <p className="text-gray-700 text-sm break-all">{supplierMeta.email}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600 font-medium mb-1">Established</p>
                    <p className="text-gray-700 text-sm">{supplierMeta.established}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Location</h4>
                    <div className="w-full h-40 bg-gray-200 overflow-hidden rounded">
                      <iframe
                        title="map"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${supplierMeta.coords[1]-0.05}%2C${supplierMeta.coords[0]-0.05}%2C${supplierMeta.coords[1]+0.05}%2C${supplierMeta.coords[0]+0.05}&layer=mapnik&marker=${supplierMeta.coords[0]}%2C${supplierMeta.coords[1]}`}
                        className="w-full h-40 border-0"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Ratings</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={14} fill={i < Math.floor(supplierMeta.rating) ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">{supplierMeta.rating} average ({supplierMeta.reviews} reviews)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Link href="/suppliers" className="text-blue-600 hover:underline">← Back to Suppliers</Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
