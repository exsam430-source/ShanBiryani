import { formatPrice } from '../../utils/formatters.js';
import { getImageUrl } from '../../utils/helpers.js';

const OrderSummary = ({ items, subtotal, deliveryFee = 0, taxAmount = 0, total }) => {
  return (
    <div className="space-y-4">
      {/* Items List */}
      <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
        {items.map((item) => {
          const price = item.discount > 0 
            ? item.price - (item.price * item.discount / 100)
            : item.price;
          
          return (
            <div key={item._id} className="flex gap-3">
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
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
        })}
      </div>

      {/* Totals */}
      <div className="border-t border-dark-lighter pt-4 space-y-2">
        <div className="flex justify-between text-text-secondary text-sm">
          <span>Subtotal</span>
          <span className="text-white">{formatPrice(subtotal)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between text-text-secondary text-sm">
            <span>Delivery Fee</span>
            <span className="text-white">{formatPrice(deliveryFee)}</span>
          </div>
        )}
        {deliveryFee === 0 && (
          <div className="flex justify-between text-text-secondary text-sm">
            <span>Delivery Fee</span>
            <span className="text-green-500">Free</span>
          </div>
        )}
        {taxAmount > 0 && (
          <div className="flex justify-between text-text-secondary text-sm">
            <span>Tax</span>
            <span className="text-white">{formatPrice(taxAmount)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-dark-lighter">
          <span className="text-white font-semibold">Total</span>
          <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;