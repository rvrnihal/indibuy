import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { ReviewProvider } from '../context/ReviewContext';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      console.log(`Route changed to: ${url}`);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ReviewProvider>
            <Component {...pageProps} />
          </ReviewProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
