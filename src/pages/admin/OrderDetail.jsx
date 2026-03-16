import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CheckCircle } from 'lucide-react';
import { orderService } from '../../services/orderService.js';
import { useToast } from '../../hooks/useToast.js';
import { ORDER_STATUSES } from '../../utils/constants.js';
import OrderDetails from '../../components/admin/orders/OrderDetails.jsx';
import Button from '../../components/common/Button.jsx';
import Select from '../../components/common/Select.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const response = await orderService.getOrder(id);
      setOrder(response.data);
    } catch (error) {
      showError('Failed to load order');
      navigate('/admin/orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      await orderService.updateOrderStatus(id, newStatus);
      showSuccess(`Order status updated to ${ORDER_STATUSES[newStatus]?.label}`);
      fetchOrder();
    } catch (error) {
      showError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!order) {
    return null;
  }

  const statusOptions = Object.entries(ORDER_STATUSES).map(([value, { label }]) => ({
    value,
    label
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 hover:bg-dark-lighter rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Order Details</h1>
            <p className="text-text-secondary mt-1">{order.orderNumber}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Status Update */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="w-48">
              <Select
                value={order.status}
                onChange={handleStatusChange}
                options={statusOptions}
                disabled={isUpdating}
              />
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print
          </Button>
        </div>
      </div>

      {/* Order Details Component */}
      <OrderDetails order={order} />
    </div>
  );
};

export default OrderDetail;