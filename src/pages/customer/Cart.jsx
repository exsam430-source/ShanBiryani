import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../hooks/useCart.js';
import { formatPrice } from '../../utils/formatters.js';
import { getImageUrl } from '../../utils/helpers.js';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

const Cart = () => {
  const { 
    items, 
    cartTotal, 
    itemCount,
    removeItem, 
    incrementQuantity, 
    decrementQuantity,
    clearCart 
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Looks like you haven't added any items to your cart yet. Explore our menu and add some delicious dishes!"
            action={() => window.location.href = '/menu'}
            actionLabel="Browse Menu"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-white">
              Your Cart
            </h1>
            <p className="text-text-secondary mt-1">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => {
              const price = item.discount > 0 
                ? item.price - (item.price * item.discount / 100)
                : item.price;
              
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 p-4 bg-dark-card rounded-xl border border-dark-lighter"
                >
                  {/* Image */}
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <p className="text-text-muted text-sm mt-1">
                          {item.category?.name || 'Special'}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decrementQuantity(item._id)}
                          className="w-8 h-8 flex items-center justify-center bg-dark-lighter text-text-secondary hover:text-white rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-white font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(item._id)}
                          className="w-8 h-8 flex items-center justify-center bg-dark-lighter text-text-secondary hover:text-white rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-text-muted text-sm">
                            {formatPrice(price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Continue Shopping */}
            <Link
              to="/menu"
              className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-card rounded-xl border border-dark-lighter p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="text-white">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery Fee</span>
                  <span className="text-green-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Tax</span>
                  <span className="text-white">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-dark-lighter pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  * Tax and delivery fee will be added at checkout
                </p>
              </div>

              <Link to="/checkout">
                <Button fullWidth size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Secure Checkout Note */}
              <p className="text-center text-text-muted text-xs mt-4">
                🔒 Secure checkout powered by SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;