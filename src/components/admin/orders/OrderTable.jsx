import { Link } from 'react-router-dom';
import { Eye, MoreVertical, Printer, XCircle, Package } from 'lucide-react';
import { formatPrice, formatSmartDate } from '../../../utils/formatters.js';
import OrderStatusBadge from './OrderStatusBadge.jsx';
import Dropdown, { DropdownItem, DropdownDivider } from '../../common/Dropdown.jsx';

const OrderTable = ({
  orders = [],
  onUpdateStatus,
  onCancelOrder,
  onPrintOrder,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-dark-card rounded-xl border border-dark-lighter">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-lighter">
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-lighter">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-full skeleton rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-dark-card rounded-xl border border-dark-lighter p-12 text-center">
        <Package className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No orders found</h3>
        <p className="text-text-secondary">Orders will appear here when customers place them.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-xl border border-dark-lighter">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-lighter bg-dark-lighter/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Order
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Items
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-dark-lighter">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-dark-lighter/30 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="text-primary hover:text-primary-light font-medium"
                  >
                    {order.orderNumber}
                  </Link>
                </td>

                <td className="px-4 py-3">
                  <div>
                    <p className="text-white">{order.customer?.name || 'Guest'}</p>
                    <p className="text-text-muted text-sm">{order.customer?.phone}</p>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="text-text-secondary">{order.items?.length || 0} items</span>
                </td>

                <td className="px-4 py-3">
                  <span className="text-white font-medium">{formatPrice(order.total)}</span>
                </td>

                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} size="sm" />
                </td>

                <td className="px-4 py-3">
                  <span className="text-text-secondary text-sm">
                    {formatSmartDate(order.createdAt)}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-end relative">
                    <Dropdown
                      align="right"
                      trigger={
                        <button
                          type="button"
                          className="p-2 hover:bg-dark-lighter rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-text-secondary" />
                        </button>
                      }
                    >
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-text-secondary hover:bg-dark-lighter hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>

                      <DropdownItem icon={Printer} onClick={() => onPrintOrder?.(order)}>
                        Print Order
                      </DropdownItem>

                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <>
                          <DropdownDivider />
                          <DropdownItem
                            icon={XCircle}
                            danger
                            onClick={() => onCancelOrder?.(order)}
                          >
                            Cancel Order
                          </DropdownItem>
                        </>
                      )}
                    </Dropdown>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;