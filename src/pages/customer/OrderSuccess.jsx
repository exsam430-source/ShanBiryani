import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Clock, Phone, Copy, ArrowRight } from 'lucide-react';
import { orderService } from '../../services/orderService.js';
import { useToast } from '../../hooks/useToast.js';
import { formatPrice, formatDateTime } from '../../utils/formatters.js';
import { copyToClipboard } from '../../utils/helpers.js';
import Button from '../../components/common/Button.jsx';
import { SectionLoader } from '../../components/common/Loader.jsx';

const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const { showSuccess } = useToast();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.trackOrder(orderNumber);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const handleCopyOrderNumber = async () => {
    const success = await copyToClipboard(orderNumber);
    if (success) {
      showSuccess('Order number copied!');
    }
  };

  if (isLoading) {
    return <SectionLoader />;
  }

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-text-secondary mb-8">
            Thank you for your order. We've received it and will start preparing it soon.
          </p>

          {/* Order Number */}
          <div className="bg-dark-card rounded-xl border border-dark-lighter p-6 mb-8">
            <p className="text-text-secondary mb-2">Your Order Number</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-primary">{orderNumber}</span>
              <button
                onClick={handleCopyOrderNumber}
                className="p-2 text-text-secondary hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Order Info */}
          {order && (
            <div className="bg-dark-card rounded-xl border border-dark-lighter p-6 mb-8 text-left">
              <h3 className="font-semibold text-white mb-4">Order Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-text-secondary text-sm">Status</p>
                    <p className="text-white capitalize">{order.status}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-text-secondary text-sm">Estimated Delivery</p>
                    <p className="text-white">30-45 minutes</p>
                  </div>
                </div>

                <div className="border-t border-dark-lighter pt-4">
                  <p className="text-text-secondary text-sm mb-2">Items</p>
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between py-1">
                      <span className="text-white">{item.name} x{item.quantity}</span>
                      <span className="text-text-secondary">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 mt-3 border-t border-dark-lighter">
                    <span className="font-semibold text-white">Total</span>
                    <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/track-order?order=${orderNumber}`}>
              <Button variant="outline" size="lg">
                Track Order
              </Button>
            </Link>
            <Link to="/menu">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-dark-lighter">
            <p className="text-text-secondary mb-4">Need help with your order?</p>
            <a 
              href="tel:+923001234567" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
            >
              <Phone className="w-5 h-5" />
              +92 300 1234567
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;