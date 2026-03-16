import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { orderService } from '../../services/orderService.js';
import { useToast } from '../../hooks/useToast.js';
import { ORDER_STATUSES } from '../../utils/constants.js';
import OrderTable from '../../components/admin/orders/OrderTable.jsx';
import Button from '../../components/common/Button.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Select from '../../components/common/Select.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [cancelOrder, setCancelOrder] = useState(null);
  
  const { showSuccess, showError } = useToast();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 15,
        search: searchQuery || undefined,
        status: statusFilter || undefined
      };
      const response = await orderService.getOrders(params);
      setOrders(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      showError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchQuery, statusFilter]);

  const handleCancelOrder = (order) => {
    setCancelOrder(order);
  };

  const confirmCancelOrder = async () => {
    if (!cancelOrder) return;
    
    setIsSubmitting(true);
    try {
      await orderService.updateOrderStatus(cancelOrder._id, 'cancelled');
      showSuccess('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      showError(error.message || 'Failed to cancel order');
    } finally {
      setIsSubmitting(false);
      setCancelOrder(null);
    }
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...Object.entries(ORDER_STATUSES).map(([value, { label }]) => ({
      value,
      label
    }))
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-text-secondary mt-1">Manage and track customer orders</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchOrders}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by order #, customer name, or phone..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Table */}
      <OrderTable
        orders={orders}
        isLoading={isLoading}
        onCancelOrder={handleCancelOrder}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={!!cancelOrder}
        onClose={() => setCancelOrder(null)}
        onConfirm={confirmCancelOrder}
        title="Cancel Order"
        message={`Are you sure you want to cancel order "${cancelOrder?.orderNumber}"? The customer will be notified and stock will be restored.`}
        confirmText="Cancel Order"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Orders;