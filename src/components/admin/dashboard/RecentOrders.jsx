import { Link } from 'react-router-dom';
import { ArrowRight, Package, Clock } from 'lucide-react';
import { formatPrice, formatRelativeTime } from '../../../utils/formatters.js';
import { getStatusColor, classNames } from '../../../utils/helpers.js';
import { ORDER_STATUSES } from '../../../utils/constants.js';
import Button from '../../common/Button.jsx';

const RecentOrders = ({ orders = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-32 skeleton rounded" />
          <div className="h-8 w-20 skeleton rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 skeleton rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 skeleton rounded" />
                <div className="h-3 w-32 skeleton rounded" />
              </div>
              <div className="h-6 w-16 skeleton rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
        <Link to="/admin/orders">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">No recent orders</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = ORDER_STATUSES[order.status] || { label: order.status };
            
            return (
              <Link
                key={order._id}
                to={`/admin/orders/${order._id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-dark-lighter transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{order.orderNumber}</span>
                    <span className={classNames(
                      'px-2 py-0.5 rounded-full text-xs font-medium capitalize border',
                      getStatusColor(order.status)
                    )}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted text-sm mt-0.5">
                    <span>{order.customer?.name || 'Guest'}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(order.createdAt)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-white font-semibold">{formatPrice(order.total)}</p>
                  <p className="text-text-muted text-xs">{order.items?.length || 0} items</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentOrders;