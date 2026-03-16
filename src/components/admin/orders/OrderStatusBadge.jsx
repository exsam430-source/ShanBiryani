import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  UtensilsCrossed,
  Package,
  Home
} from 'lucide-react';
import { classNames } from '../../../utils/helpers.js';
import { ORDER_STATUSES } from '../../../utils/constants.js';

const statusConfig = {
  pending: {
    icon: Clock,
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-500/30'
  },
  confirmed: {
    icon: CheckCircle,
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/30'
  },
  preparing: {
    icon: UtensilsCrossed,
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500/30'
  },
  ready: {
    icon: Package,
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-500',
    borderColor: 'border-purple-500/30'
  },
  'out-for-delivery': {
    icon: Truck,
    bgColor: 'bg-indigo-500/20',
    textColor: 'text-indigo-500',
    borderColor: 'border-indigo-500/30'
  },
  delivered: {
    icon: Home,
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-500',
    borderColor: 'border-green-500/30'
  },
  cancelled: {
    icon: XCircle,
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-500',
    borderColor: 'border-red-500/30'
  }
};

const OrderStatusBadge = ({ status, size = 'md', showIcon = true }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const statusInfo = ORDER_STATUSES[status] || { label: status };
  const Icon = config.icon;

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 font-medium rounded-full border capitalize',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizes[size]
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {statusInfo.label}
    </span>
  );
};

export default OrderStatusBadge;