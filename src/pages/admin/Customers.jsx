import { useState, useEffect } from 'react';
import { Users, ShoppingBag, Phone, Mail } from 'lucide-react';
import { authService } from '../../services/authService.js';
import { useToast } from '../../hooks/useToast.js';
import { formatSmartDate, formatPrice } from '../../utils/formatters.js';
import UserTable from '../../components/admin/users/UserTable.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import Modal from '../../components/common/Modal.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const { showSuccess, showError } = useToast();

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await authService.getAllCustomers({
        page: currentPage,
        limit: 15,
        search: searchQuery || undefined
      });
      setCustomers(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      showError('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchQuery]);

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleToggleStatus = async (customer) => {
    try {
      await authService.toggleUserStatus(customer._id);
      showSuccess(`Customer ${customer.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchCustomers();
    } catch (error) {
      showError(error.message || 'Failed to update customer status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-text-secondary mt-1">View and manage registered customers</p>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search customers by name, email or phone..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {/* Customers Table */}
      <UserTable
        users={customers}
        isLoading={isLoading}
        onEdit={handleViewCustomer}
        onToggleStatus={handleToggleStatus}
        showRole={false}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Customer Details Modal */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title="Customer Details"
        size="md"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <Avatar name={selectedCustomer.name} size="xl" />
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedCustomer.name}</h3>
                <Badge variant={selectedCustomer.isActive ? 'success' : 'danger'}>
                  {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-dark-lighter rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-text-muted text-sm">Email</p>
                  <p className="text-white">{selectedCustomer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-dark-lighter rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-text-muted text-sm">Phone</p>
                  <p className="text-white">{selectedCustomer.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-dark-lighter rounded-lg text-center">
                <ShoppingBag className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {selectedCustomer.orderHistory?.length || 0}
                </p>
                <p className="text-text-muted text-sm">Total Orders</p>
              </div>
              <div className="p-4 bg-dark-lighter rounded-lg text-center">
                <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {formatSmartDate(selectedCustomer.createdAt)}
                </p>
                <p className="text-text-muted text-sm">Member Since</p>
              </div>
            </div>

            {/* Address */}
            {selectedCustomer.address && (
              <div className="p-4 bg-dark-lighter rounded-lg">
                <p className="text-text-muted text-sm mb-1">Address</p>
                <p className="text-white">{selectedCustomer.address}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-dark-lighter">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCustomer(null)}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                variant={selectedCustomer.isActive ? 'danger' : 'primary'}
                onClick={() => {
                  handleToggleStatus(selectedCustomer);
                  setSelectedCustomer(null);
                }}
                className="flex-1"
              >
                {selectedCustomer.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Customers;