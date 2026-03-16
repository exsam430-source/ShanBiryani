import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  User, 
  LogOut, 
  ChevronDown,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useCart } from '../../hooks/useCart.js';
import { classNames } from '../../utils/helpers.js';
import Button from '../common/Button.jsx';
import CartDrawer from '../cart/CartDrawer.jsx';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, openCart, isOpen: isCartOpen, closeCart } = useCart();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-dark-light border-b border-dark-lighter">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-6 text-text-secondary">
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary" />
                +92 300 1234567
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Karachi, Pakistan
              </span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Open: 11:00 AM - 11:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={classNames(
          'sticky top-0 z-[100] transition-all duration-300',
          isScrolled
            ? 'bg-dark/95 backdrop-blur-lg shadow-lg border-b border-dark-lighter'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl font-heading">S</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-heading text-white">
                  Shan <span className="text-primary">Biryani</span>
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    classNames(
                      'relative text-sm font-medium transition-colors hover-underline',
                      isActive ? 'text-primary' : 'text-text-secondary hover:text-white'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-2 text-text-secondary hover:text-white transition-colors"
              >
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </button>

              {/* User Menu / Auth Buttons */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 text-text-secondary hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                    <ChevronDown className="w-4 h-4 hidden md:block" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-dark-card rounded-xl border border-dark-lighter shadow-xl overflow-hidden"
                      >
                        <div className="p-3 border-b border-dark-lighter">
                          <p className="text-sm font-medium text-white">{user?.name}</p>
                          <p className="text-xs text-text-muted">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/my-orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            My Orders
                          </Link>
                          {(user?.role === 'admin' || user?.role === 'staff') && (
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
                            >
                              <User className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-text-secondary hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-dark-card border-t border-dark-lighter"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        classNames(
                          'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary/20 text-primary'
                            : 'text-text-secondary hover:bg-dark-lighter hover:text-white'
                        )
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}

                  {!isAuthenticated && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-dark-lighter">
                      <Link to="/login" className="flex-1">
                        <Button variant="outline" fullWidth>Login</Button>
                      </Link>
                      <Link to="/register" className="flex-1">
                        <Button variant="primary" fullWidth>Sign Up</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

      {/* Overlay for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-[50]"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;