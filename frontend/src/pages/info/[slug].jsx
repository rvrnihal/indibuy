import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Link from 'next/link';

const pages = {
  about: { title: 'About Us', content: 'IndiBuy is a premier B2B marketplace connecting buyers and suppliers across industrial sectors.' },
  careers: { title: 'Careers', content: 'Join IndiBuy — we are hiring across product, engineering, and operations.' },
  blog: { title: 'Blog', content: 'Read insights on industrial procurement, vendor onboarding, and market trends.' },
  press: { title: 'Press', content: 'Press releases and media coverage for IndiBuy.' },
  contact: { title: 'Contact Us', content: 'For inquiries, email info@indibuy.com or use our support portal.' },
  'help-center': { title: 'Help Center', content: 'Find guides on ordering, shipping, returns, and payments.' },
  'shipping-info': { title: 'Shipping Info', content: 'Shipping timelines and carrier information.' },
  'return-policy': { title: 'Return Policy', content: 'Details about returns and refunds.' },
  'privacy-policy': { title: 'Privacy Policy', content: 'Our privacy practices and data handling.' },
  'terms-of-service': { title: 'Terms of Service', content: 'Terms that govern use of IndiBuy.' },
  'cookie-policy': { title: 'Cookie Policy', content: 'How we use cookies and similar technologies.' },
  'refund-policy': { title: 'Refund Policy', content: 'How refunds are processed and timelines.' },
  security: { title: 'Security', content: 'Security measures and best practices.' },
  accessibility: { title: 'Accessibility', content: 'Accessibility statement and support.' },
  sitemap: { title: 'Sitemap', content: 'Quick links to sections of the site.' }
};

export default function InfoPage() {
  const router = useRouter();
  const { slug } = router.query;
  if (!slug) return null;

  const page = pages[slug] || { title: 'Information', content: 'Content coming soon.' };

  return (
    <>
      <Head>
        <title>{page.title} - IndiBuy</title>
        <meta name="description" content={`${page.title} - IndiBuy`} />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-lg shadow">
            <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
            <p className="text-gray-700 mb-6">{page.content}</p>
            <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
          </div>
        </div>
      </Layout>
    </>
  );
}
