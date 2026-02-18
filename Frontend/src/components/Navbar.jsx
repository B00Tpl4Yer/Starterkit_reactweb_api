import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, Citrus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Button from './Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Produk', path: '/products' },
    { name: 'Tentang', path: '/about' },
    { name: 'Kontak', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-orange-500 p-2 rounded-full text-white group-hover:scale-110 transition-transform">
              <Citrus size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Cemilan<span className="text-gray-800">Sultan</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-orange-500 ${
                  location.pathname === link.path ? 'text-orange-600' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors">
              <ShoppingCart size={24} />
              {getCartItemCount() > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {getCartItemCount()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 cursor-pointer">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <User size={18} />
                  </div>
                  <span className="font-medium text-sm">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all transform origin-top-right">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 font-medium">Dashboard</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 font-medium">Pesanan Saya</Link>
                  {isAdmin() && (
                    <>
                      <div className="h-px bg-gray-100 my-1 mx-2"></div>
                      <div className="px-4 py-1 text-xs text-gray-500 font-semibold uppercase">Admin Menu</div>
                      <Link to="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 font-medium">List Semua User</Link>
                      <Link to="/admin/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 font-medium">List Semua Order</Link>
                    </>
                  )}
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 font-medium">
                    Edit Profile
                  </Link>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer font-medium">Logout</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="px-4 py-2">Masuk</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="px-4 py-2">Daftar</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-gray-600 font-medium hover:text-orange-500"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t space-y-3">
                <Link to="/cart" className="flex items-center space-x-2 text-gray-600">
                  <ShoppingCart size={20} />
                  <span>Keranjang ({getCartItemCount()})</span>
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="block text-gray-600 font-medium">Dashboard</Link>
                    <Link to="/orders" className="block text-gray-600 font-medium">Pesanan Saya</Link>
                    {isAdmin() && (
                      <>
                        <div className="pt-2 border-t">
                          <div className="text-xs text-gray-500 font-semibold uppercase mb-2">Admin Menu</div>
                          <Link to="/admin/users" className="block text-gray-600 font-medium mb-2">List Semua User</Link>
                          <Link to="/admin/orders" className="block text-gray-600 font-medium">List Semua Order</Link>
                        </div>
                      </>
                    )}
                    <Link to="/profile" className="block text-gray-600 font-medium">Edit Profile</Link>
                    <button onClick={logout} className="block text-red-600 font-medium pt-2 border-t">Logout</button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/login">
                      <Button variant="outline" fullWidth>Masuk</Button>
                    </Link>
                    <Link to="/register">
                      <Button fullWidth>Daftar</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
