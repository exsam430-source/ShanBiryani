import { motion } from 'framer-motion';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  UtensilsCrossed,
  XCircle,
  Home
} from 'lucide-react';
import { classNames } from '../../utils/helpers.js';
import { formatSmartDate } from '../../utils/formatters.js';

const OrderTracker = ({ order, compact = false }) => {
  const statusSteps = [
    { status: 'pending', label: 'Order Placed', icon: Package },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { status: 'preparing', label: 'Preparing', icon: UtensilsCrossed },
    { status: 'ready', label: 'Ready', icon: Package },
    { status: 'out-for-delivery', label: 'On the Way', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: Home }
  ];

  const getStatusIndex = (status) => {
    if (status === 'cancelled') return -1;
    return statusSteps.findIndex(s => s.status === status);
  };

  const currentStatusIndex = getStatusIndex(order?.status);

  if (!order) return null;

  // Cancelled order display
  if (order.status === 'cancelled') {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-500 mb-1">Order Cancelled</h3>
        <p className="text-text-secondary text-sm">This order has been cancelled</p>
      </div>
    );
  }

  // Compact view for cards
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          
          return (
            <div key={step.status} className="flex items-center">
              <div
                className={classNames(
                  'w-6 h-6 rounded-full flex items-center justify-center',
                  isCompleted ? 'bg-primary' : 'bg-dark-lighter',
                  isCurrent && 'ring-2 ring-primary/30'
                )}
              >
                <step.icon className={classNames(
                  'w-3 h-3',
                  isCompleted ? 'text-white' : 'text-text-muted'
                )} />
              </div>
              {index < statusSteps.length - 1 && (
                <div className={classNames(
                  'w-4 h-0.5',
                  index < currentStatusIndex ? 'bg-primary' : 'bg-dark-lighter'
                )} />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Full view
  return (
    <div className="relative py-4">
      {/* Progress Line Background */}
      <div className="absolute top-9 left-5 right-5 h-1 bg-dark-lighter rounded-full" />
      
      {/* Progress Line Fill */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ 
          width: `calc(${(currentStatusIndex / (statusSteps.length - 1)) * 100}% - 40px)` 
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="absolute top-9 left-5 h-1 bg-primary rounded-full"
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          
          return (
            <div key={step.status} className="flex flex-col items-center relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={classNames(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  isCompleted 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-dark-lighter text-text-muted',
                  isCurrent && 'ring-4 ring-primary/30'
                )}
              >
                <step.icon className="w-5 h-5" />
              </motion.div>
              <span className={classNames(
                'text-xs mt-2 text-center max-w-[70px] leading-tight',
                isCurrent ? 'text-primary font-medium' : isCompleted ? 'text-white' : 'text-text-muted'
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Status Info */}
      {order.estimatedDeliveryTime && order.status !== 'delivered' && (
        <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-white font-medium">Estimated Delivery</p>
              <p className="text-text-secondary text-sm">
                {formatSmartDate(order.estimatedDeliveryTime)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delivered Message */}
      {order.status === 'delivered' && (
        <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-white font-medium">Order Delivered!</p>
              <p className="text-text-secondary text-sm">
                {order.actualDeliveryTime 
                  ? `Delivered on ${formatSmartDate(order.actualDeliveryTime)}`
                  : 'Thank you for ordering with us!'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;