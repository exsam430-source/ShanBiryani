import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download, Printer, Receipt } from 'lucide-react';
import { billService } from '../../services/billService.js';
import { useToast } from '../../hooks/useToast.js';
import { formatPrice, formatSmartDate } from '../../utils/formatters.js';
import { getStatusColor } from '../../utils/helpers.js';
import Button from '../../components/common/Button.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Select from '../../components/common/Select.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import Badge from '../../components/common/Badge.jsx';
import DatePicker from '../../components/common/DatePicker.jsx';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { showSuccess, showError } = useToast();

  const fetchBills = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 15,
        search: searchQuery || undefined,
        paymentStatus: paymentFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      };
      const response = await billService.getBills(params);
      setBills(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      showError('Failed to load bills');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [currentPage, searchQuery, paymentFilter, startDate, endDate]);

  const handleExport = async () => {
    try {
      const blob = await billService.exportBills({ startDate, endDate });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bills_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      showSuccess('Bills exported successfully');
    } catch (error) {
      showError('Failed to export bills');
    }
  };

  const paymentOptions = [
    { value: '', label: 'All Payments' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'refunded', label: 'Refunded' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Bills History</h1>
          <p className="text-text-secondary mt-1">View and manage all bills</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleExport}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SearchBar
          placeholder="Search by bill #..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <Select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          options={paymentOptions}
        />
        <DatePicker
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <DatePicker
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
        />
      </div>

      {/* Bills Table */}
      <div className="bg-dark-card rounded-xl border border-dark-lighter overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-lighter bg-dark-lighter/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Bill #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Items</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-lighter">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 skeleton rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Receipt className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <p className="text-text-secondary">No bills found</p>
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-dark-lighter/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-primary font-medium">{bill.billNumber}</span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-sm">
                      {formatSmartDate(bill.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {bill.customerName || 'Walk-in'}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {bill.items?.length || 0} items
                    </td>
                    <td className="px-4 py-3 text-white font-medium">
                      {formatPrice(bill.grandTotal)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary capitalize">
                      {bill.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={bill.paymentStatus === 'paid' ? 'success' : 'warning'}>
                        {bill.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/bills/${bill._id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Bills;