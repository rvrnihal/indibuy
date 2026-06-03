import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IB</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline text-gray-900">IndiBuy</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Categories
            </Link>
            <Link href="/suppliers" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Suppliers
            </Link>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-blue-600 transition relative"
              >
                <FaShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </motion.button>
            </Link>

            {/* Wishlist Icon */}
            <Link href="/wishlist" className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-red-500 transition relative"
              >
                <FaHeart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </motion.button>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative hidden sm:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <FaUser size={16} />
                  <span className="text-sm font-medium">{user.name || user.email?.split('@')[0]}</span>
                </motion.button>

                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <Link href="/profile">
                      <button
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FaUser size={14} /> My Profile
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-200 mt-2 pt-2"
                    >
                      <FaSignOutAlt size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-medium"
                >
                  Join Now
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 border-t space-y-2"
          >
            <Link href="/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Products
            </Link>
            <Link href="/categories" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Categories
            </Link>
            <Link href="/suppliers" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Suppliers
            </Link>
            <Link href="/cart" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              <FaShoppingCart /> Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            <Link href="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              <FaHeart /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            <div className="border-t pt-2">
              {user ? (
                <>
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <FaUser /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50">
                    Sign In
                  </Link>
                  <Link href="/register" className="block px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50">
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
