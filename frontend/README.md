# IndiBuy Frontend - Installation & Setup Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Development](#development)
5. [Building](#building)
6. [Project Structure](#project-structure)
7. [Component Library](#component-library)
8. [Styling](#styling)
9. [Performance](#performance)
10. [Deployment](#deployment)

---

## Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: For cloning the repository
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/indibuy.git
cd indibuy/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env.local
```

### 4. Configure Environment Variables

Edit `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_API_TIMEOUT=30000

# Application URLs
NEXT_PUBLIC_APP_NAME=IndiBuy
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Payment Gateways
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key

# Cloud Storage
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Socket.io
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Features
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_AR_PREVIEW=false
```

---

## Development

### Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

**Features:**
- Hot module replacement (HMR)
- Fast refresh
- Optimized compilation

### Development Server Output

```
> next dev

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
event - compiled client and server successfully
```

---

## Building

### Production Build

```bash
npm run build
```

This will:
1. Compile Next.js
2. Generate static pages
3. Optimize for production
4. Create `.next` folder

### Start Production Server

```bash
npm start
```

### Build Output

```
> next start

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## Project Structure

```
frontend/
├── src/
│   ├── pages/                    # Next.js pages (routes)
│   │   ├── index.jsx            # Home page
│   │   ├── products.jsx         # Products listing
│   │   ├── login.jsx
│   │   ├── register.jsx
│   │   ├── [dynamicpage].jsx    # Dynamic routes
│   │   ├── 404.jsx              # Custom 404
│   │   ├── 500.jsx              # Custom 500
│   │   ├── _app.jsx             # App wrapper
│   │   └── _document.jsx        # Document wrapper
│   │
│   ├── components/               # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── Hero.jsx
│   │   ├── ProductCard.jsx
│   │   └── ...
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useFetch.js
│   │   └── ...
│   │
│   ├── context/                  # React Context
│   │   ├── AuthContext.js
│   │   ├── CartContext.js
│   │   └── ...
│   │
│   ├── utils/                    # Utility functions
│   │   ├── api.js              # API wrapper
│   │   ├── validators.js       # Form validators
│   │   ├── formatters.js       # Data formatters
│   │   └── ...
│   │
│   └── styles/                   # Global styles
│       ├── globals.css
│       └── variables.css
│
├── public/                       # Static assets
│   ├── images/
│   ├── icons/
│   ├── favicon.ico
│   └── robots.txt
│
├── .next/                        # Build output (auto-generated)
├── node_modules/                 # Dependencies
├── .env.example                  # Environment template
├── .gitignore
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS config
├── postcss.config.js            # PostCSS config
├── package.json
└── README.md
```

---

## Component Library

### Built-in Components

#### Layout Components

```jsx
import Layout from '@/components/Layout';

export default function Page() {
  return (
    <Layout>
      <h1>Welcome to IndiBuy</h1>
    </Layout>
  );
}
```

#### Navigation

```jsx
import Navbar from '@/components/Navbar';

// Already included in Layout component
```

#### Product Card

```jsx
import ProductCard from '@/components/ProductCard';

<ProductCard 
  product={product}
  onAddToCart={handleAddToCart}
/>
```

### Third-Party Components

- **ShadCN UI**: Pre-built components
- **Framer Motion**: Animations
- **React Icons**: Icon library

### Creating Components

```jsx
// components/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ children, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-4 py-2 bg-blue-600 text-white rounded"
      {...props}
    >
      {children}
    </motion.button>
  );
}
```

---

## Styling

### Tailwind CSS

All styling uses Tailwind CSS utility classes:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 bg-white rounded-lg shadow">
    Content
  </div>
</div>
```

### Custom CSS

Global styles in `src/styles/globals.css`:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #4f46e5;
}

.custom-class {
  @apply p-4 bg-blue-50 rounded-lg;
}
```

### Dark Mode

Enable dark mode in `tailwind.config.js`:

```js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {}
  }
}
```

Use in components:

```jsx
<div className="bg-white dark:bg-gray-900">
  Content
</div>
```

---

## Performance

### Image Optimization

```jsx
import Image from 'next/image';

<Image
  src="/images/product.jpg"
  alt="Product"
  width={400}
  height={300}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

### Code Splitting

```jsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>Loading...</p>
});
```

### Font Optimization

Use `next/font` for optimized fonts:

```jsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

### Lazy Loading

```jsx
// Lazy load components that are not immediately visible
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OffscreenComponent />
    </Suspense>
  );
}
```

### Performance Monitoring

```jsx
// Track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(metric) {
  console.log(metric);
}
```

---

## API Integration

### API Wrapper

```jsx
// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: process.env.NEXT_PUBLIC_API_TIMEOUT
});

// Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Using API in Components

```jsx
import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

## State Management

### Context API

```jsx
// context/AuthContext.js
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Custom Hook

```jsx
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Form Handling

### React Hook Form

```jsx
import { useForm } from 'react-hook-form';

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', { required: 'Email is required' })}
        type="email"
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Testing

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

---

## Linting & Formatting

### ESLint

```bash
npm run lint
npm run lint:fix
```

### Prettier

```bash
npm run format
```

---

## SEO Optimization

```jsx
import Head from 'next/head';

export default function Page() {
  return (
    <>
      <Head>
        <title>Product - IndiBuy</title>
        <meta name="description" content="Buy industrial products on IndiBuy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://indibuy.com/products" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Product - IndiBuy" />
        <meta property="og:description" content="Buy industrial products" />
        <meta property="og:image" content="/og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <h1>Products</h1>
    </>
  );
}
```

---

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Other Platforms

See [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)

---

## Troubleshooting

### Port Already in Use

```bash
# Use different port
npm run dev -- -p 3001
```

### Clear Cache

```bash
rm -rf .next
npm run build
```

### Module Not Found

```bash
rm -rf node_modules
npm install
```

---

## Environment Variables Reference

| Variable | Required | Type | Description |
|----------|----------|------|-------------|
| NEXT_PUBLIC_API_BASE_URL | Yes | String | Backend API URL |
| NEXT_PUBLIC_APP_NAME | No | String | App name |
| NEXT_PUBLIC_GOOGLE_CLIENT_ID | No | String | Google OAuth ID |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | No | String | Stripe public key |
| NEXT_PUBLIC_RAZORPAY_KEY_ID | No | String | Razorpay key ID |

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Performance Best Practices

1. ✅ Use Next.js Image component
2. ✅ Implement code splitting
3. ✅ Lazy load components
4. ✅ Optimize font loading
5. ✅ Use CSS modules or Tailwind
6. ✅ Minimize JavaScript
7. ✅ Enable compression
8. ✅ Use CDN for assets

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev
- **GitHub Issues**: Report bugs

---

## License

Proprietary - IndiBuy Platform

