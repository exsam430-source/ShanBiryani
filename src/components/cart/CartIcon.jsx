import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../hooks/useCart.js';
import { classNames } from '../../utils/helpers.js';

const CartIcon = ({ onClick, className = '' }) => {
  const { itemCount } = useCart();

  return (
    <button
      onClick={onClick}
      className={classNames(
        'relative p-2 text-text-secondary hover:text-white transition-colors',
        className
      )}
      aria-label={`Cart with ${itemCount} items`}
    >
      <ShoppingBag className="w-6 h-6" />
      
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {itemCount > 9 ? '9+' : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default CartIcon;