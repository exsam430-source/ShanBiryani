import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../hooks/useCart.js';
import { formatPrice } from '../../utils/formatters.js';
import { getImageUrl } from '../../utils/helpers.js';
import Button from '../common/Button.jsx';

const CartDrawer = ({ isOpen, onClose }) => {
  const { 
    items, 
    cartTotal, 
    itemCount,
    removeItem, 
    incrementQuantity, 
    decrementQuantity,
    clearCart 
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-card border-l border-dark-lighter z-[201] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-lighter">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-white">Your Cart</h2>
                <span className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
                  {itemCount}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-text-secondary hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-dark-lighter flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Your cart is empty</h3>
                  <p className="text-text-secondary mb-6">Add some delicious items to get started!</p>
                  <Button onClick={onClose}>
                    Browse Menu
                  </Button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {items.map((item) => {
                    const price = item.discount > 0 
                      ? item.price - (item.price * item.discount / 100)
                      : item.price;
                    
                    return (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-4 p-3 bg-dark-lighter rounded-xl"
                      >
                        {/* Image */}
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{item.name}</h4>
                          <p className="text-primary font-semibold mt-1">
                            {formatPrice(price)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 bg-dark-card rounded-lg">
                              <button
                                onClick={() => decrementQuantity(item._id)}
                                className="p-1.5 text-text-secondary hover:text-white transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center text-white font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => incrementQuantity(item._id)}
                                className="p-1.5 text-text-secondary hover:text-white transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item._id)}
                              className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-white font-semibold">
                            {formatPrice(price * item.quantity)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-dark-lighter p-4 space-y-4">
                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>

                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="text-text-secondary">Subtotal:</span>
                  <span className="text-white font-bold">{formatPrice(cartTotal)}</span>
                </div>

                {/* Checkout Button */}
                <Link to="/checkout" onClick={onClose}>
                  <Button fullWidth size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={onClose}
                  className="w-full text-center text-sm text-text-secondary hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;