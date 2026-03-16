import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Tag } from 'lucide-react';
import { useCart } from '../../hooks/useCart.js';
import { formatPrice } from '../../utils/formatters.js';
import Button from '../common/Button.jsx';

const CartSummary = ({ showCheckoutButton = true, className = '' }) => {
  const { items, cartTotal, itemCount } = useCart();

  // Example values - these would come from settings in a real app
  const deliveryFee = cartTotal >= 1000 ? 0 : 100;
  const taxRate = 16;
  const taxAmount = (cartTotal * taxRate) / 100;
  const grandTotal = cartTotal + deliveryFee + taxAmount;

  return (
    <div className={`bg-dark-card rounded-xl border border-dark-lighter p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal ({itemCount} items)</span>
          <span className="text-white">{formatPrice(cartTotal)}</span>
        </div>
        
        <div className="flex justify-between text-text-secondary">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Delivery Fee
          </span>
          {deliveryFee === 0 ? (
            <span className="text-green-500">Free</span>
          ) : (
            <span className="text-white">{formatPrice(deliveryFee)}</span>
          )}
        </div>

        <div className="flex justify-between text-text-secondary">
          <span>Tax ({taxRate}%)</span>
          <span className="text-white">{formatPrice(taxAmount)}</span>
        </div>
      </div>

      {/* Free Delivery Threshold */}
      {cartTotal < 1000 && (
        <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-primary">
            Add {formatPrice(1000 - cartTotal)} more for free delivery!
          </p>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-dark-lighter pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-white">Total</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(grandTotal)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && (
        <Link to="/checkout">
          <Button fullWidth size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Proceed to Checkout
          </Button>
        </Link>
      )}

      {/* Security Note */}
      <p className="text-center text-text-muted text-xs mt-4">
        🔒 Secure checkout • SSL encrypted
      </p>
    </div>
  );
};

export default CartSummary;