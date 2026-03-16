import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  FileText, 
  CreditCard,
  Clock,
  Package
} from 'lucide-react';
import { formatPrice, formatSmartDate } from '../../../utils/formatters.js';
import { getImageUrl } from '../../../utils/helpers.js';
import { PAYMENT_METHODS } from '../../../utils/constants.js';
import OrderStatusBadge from './OrderStatusBadge.jsx';
import OrderTimeline from '../../orders/OrderTimeline.jsx';
import Card from '../../common/Card.jsx';

const OrderDetails = ({ order }) => {
  if (!order) return null;

  const paymentMethod = PAYMENT_METHODS[order.paymentMethod] || { label: order.paymentMethod };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{order.orderNumber}</h2>
          <p className="text-text-secondary mt-1">
            Placed on {formatSmartDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} size="lg" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-dark-lighter rounded-lg">
                  <img
                    src={getImageUrl(item.menuItem?.image)}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.name}</h4>
                    <p className="text-text-muted text-sm">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{formatPrice(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="mt-6 pt-4 border-t border-dark-lighter space-y-2">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(order.subtotal)}</span>
              </div>
              {order.deliveryCharges > 0 && (
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery Fee</span>
                  <span className="text-white">{formatPrice(order.deliveryCharges)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-text-secondary">
                  <span>Tax ({order.taxRate}%)</span>
                  <span className="text-white">{formatPrice(order.tax)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-dark-lighter">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          </Card>

          {/* Status Timeline */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Status History</h3>
            <OrderTimeline statusHistory={order.statusHistory} />
          </Card>
        </div>

        {/* Right Column - Customer & Order Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Customer Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-text-muted text-sm">Name</p>
                  <p className="text-white">{order.customer?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-text-muted text-sm">Phone</p>
                  <p className="text-white">{order.customer?.phone || 'N/A'}</p>
                </div>
              </div>
              {order.customer?.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-text-muted text-sm">Email</p>
                    <p className="text-white">{order.customer.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-text-muted text-sm">Address</p>
                  <p className="text-white">{order.customer?.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Order Info */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Order Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-text-muted text-sm">Order Type</p>
                  <p className="text-white capitalize">{order.orderType}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-text-muted text-sm">Payment</p>
                  <p className="text-white">{paymentMethod.label}</p>
                </div>
              </div>
              {order.notes && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-text-muted text-sm">Notes</p>
                    <p className="text-white">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;