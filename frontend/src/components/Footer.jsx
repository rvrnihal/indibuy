import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/info/about' },
        { label: 'Careers', href: '/info/careers' },
        { label: 'Blog', href: '/info/blog' },
        { label: 'Press', href: '/info/press' }
      ]
    },
    {
      title: 'Services',
      links: [
        { label: 'For Buyers', href: '/products' },
        { label: 'For Sellers', href: '/suppliers' },
        { label: 'Vendor Dashboard', href: '/suppliers' },
        { label: 'Admin Panel', href: '/info/about' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '/info/contact' },
        { label: 'Help Center', href: '/info/help-center' },
        { label: 'Shipping Info', href: '/info/shipping-info' },
        { label: 'Return Policy', href: '/info/return-policy' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/info/privacy-policy' },
        { label: 'Terms of Service', href: '/info/terms-of-service' },
        { label: 'Cookie Policy', href: '/info/cookie-policy' },
        { label: 'Refund Policy', href: '/info/refund-policy' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IB</span>
              </div>
              <span className="font-bold text-xl">IndiBuy</span>
            </div>
            <p className="text-gray-400 text-sm">
              Premier B2B marketplace for industrial and construction products.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.5 4C1.678 4 1 4.678 1 5.5v9C1 15.322 1.678 16 2.5 16h15c.822 0 1.5-.678 1.5-1.5v-9C20 4.678 19.322 4 18.5 4h-16z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Links Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="text-gray-400 hover:text-blue-400 transition text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2026 IndiBuy. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/info/security" className="hover:text-blue-400 transition">Security</Link>
            <Link href="/info/accessibility" className="hover:text-blue-400 transition">Accessibility</Link>
            <Link href="/info/sitemap" className="hover:text-blue-400 transition">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
