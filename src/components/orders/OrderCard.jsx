import { Link } from 'react-router-dom';
import { Package, Clock, ArrowRight, MapPin } from 'lucide-react';
import { formatPrice, formatSmartDate } from '../../utils/formatters.js';
import { getStatusColor, classNames } from '../../utils/helpers.js';
import { ORDER_STATUSES } from '../../utils/constants.js';
import Badge from '../common/Badge.jsx';

const OrderCard = ({ order, showActions = true }) => {
  const statusInfo = ORDER_STATUSES[order.status] || { label: order.status, color: 'gray' };

  return (
    <div className="bg-dark-card rounded-xl border border-dark-lighter p-4 md:p-6 hover:border-primary/30 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-white font-semibold">{order.orderNumber}</h3>
          <p className="text-text-muted text-sm mt-0.5">
            {formatSmartDate(order.createdAt)}
          </p>
        </div>
        <span className={classNames(
          'px-3 py-1 rounded-full text-sm font-medium capitalize border inline-flex items-center gap-2 w-fit',
          getStatusColor(order.status)
        )}>
          {statusInfo.label}
        </span>
      </div>

      {/* Items Preview */}
      <div className="space-y-2 mb-4">
        {order.items?.slice(0, 3).map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-text-secondary">
              {item.quantity}x {item.name}
            </span>
            <span className="text-white">{formatPrice(item.subtotal)}</span>
          </div>
        ))}
        {order.items?.length > 3 && (
          <p className="text-text-muted text-sm">
            +{order.items.length - 3} more items
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-dark-lighter">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-text-secondary">
            <Package className="w-4 h-4" />
            <span className="text-sm">{order.items?.length || 0} items</span>
          </div>
          <div>
            <span className="text-lg font-bold text-primary">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {showActions && (
          <Link 
            to={`/track-order?order=${order.orderNumber}`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors text-sm font-medium"
          >
            Track Order
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default OrderCard;