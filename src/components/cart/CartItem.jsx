import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../hooks/useCart.js';
import { formatPrice } from '../../utils/formatters.js';
import { getImageUrl } from '../../utils/helpers.js';

const CartItem = ({ item, compact = false }) => {
  const { removeItem, incrementQuantity, decrementQuantity } = useCart();

  const price = item.discount > 0 
    ? item.price - (item.price * item.discount / 100)
    : item.price;

  if (compact) {
    return (
      <div className="flex items-center gap-3 py-2">
        <img
          src={getImageUrl(item.image)}
          alt={item.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
          <p className="text-text-muted text-xs">Qty: {item.quantity}</p>
        </div>
        <span className="text-primary font-medium text-sm">
          {formatPrice(price * item.quantity)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 bg-dark-lighter rounded-xl">
      {/* Image */}
      <img
        src={getImageUrl(item.image)}
        alt={item.name}
        className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover flex-shrink-0"
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-white font-medium">{item.name}</h4>
            <p className="text-text-muted text-sm mt-0.5">
              {item.category?.name || 'Special'}
            </p>
          </div>
          <button
            onClick={() => removeItem(item._id)}
            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 bg-dark-card rounded-lg">
            <button
              onClick={() => decrementQuantity(item._id)}
              className="p-2 text-text-secondary hover:text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-white font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => incrementQuantity(item._id)}
              className="p-2 text-text-secondary hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-primary font-semibold">
              {formatPrice(price * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-text-muted text-xs">
                {formatPrice(price)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;