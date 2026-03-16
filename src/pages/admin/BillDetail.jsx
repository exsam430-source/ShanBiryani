// frontend/src/pages/admin/BillDetail.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Share2 } from 'lucide-react';
import { billService } from '../../services/billService.js';
import { useToast } from '../../hooks/useToast.js';
import { formatPrice, formatDateTime } from '../../utils/formatters.js';
import { downloadInvoicePDF, shareInvoicePDF, openPrintWindow } from '../../utils/pdfGenerator.js';
import InvoicePrint from '../../components/admin/billing/InvoicePrint.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';

const BillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const invoiceRef = useRef(null);
  
  const [bill, setBill] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await billService.getBill(id);
        setBill(response.data);
        setRestaurant(response.restaurant);
      } catch (error) {
        showError('Failed to load bill');
        navigate('/admin/bills');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBill();
  }, [id, navigate, showError]);

  const handlePrint = () => {
    if (bill) {
      openPrintWindow(bill, restaurant);
    }
  };

  const handleDownload = () => {
    if (bill) {
      const success = downloadInvoicePDF(bill, restaurant);
      if (success) {
        showSuccess('Invoice downloaded');
      }
    }
  };

  const handleShare = async () => {
    if (bill) {
      await shareInvoicePDF(bill, restaurant);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!bill) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/bills')}
            className="p-2 hover:bg-dark-lighter rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Bill Details</h1>
            <p className="text-text-secondary mt-1">{bill.billNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDownload}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShare}
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            Share
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bill Info */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Bill Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Bill Number</span>
              <span className="text-white">{bill.billNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Date</span>
              <span className="text-white">{formatDateTime(bill.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Customer</span>
              <span className="text-white">{bill.customerName || 'Walk-in'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Bill Type</span>
              <span className="text-white capitalize">{bill.billType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Payment Method</span>
              <span className="text-white capitalize">{bill.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Payment Status</span>
              <Badge variant={bill.paymentStatus === 'paid' ? 'success' : 'warning'}>
                {bill.paymentStatus}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Created By</span>
              <span className="text-white">{bill.createdBy?.name || 'N/A'}</span>
            </div>
          </div>
        </Card>

        {/* Items & Totals */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Items</h3>
          <div className="space-y-2 mb-4">
            {bill.items?.map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-dark-lighter last:border-0">
                <div>
                  <span className="text-white">{item.name}</span>
                  <span className="text-text-muted ml-2">x{item.quantity}</span>
                </div>
                <span className="text-white">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-dark-lighter space-y-2">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span className="text-white">{formatPrice(bill.subtotal)}</span>
            </div>
            {bill.discountAmount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount</span>
                <span>-{formatPrice(bill.discountAmount)}</span>
              </div>
            )}
            {bill.taxAmount > 0 && (
              <div className="flex justify-between text-text-secondary">
                <span>Tax ({bill.taxRate}%)</span>
                <span className="text-white">{formatPrice(bill.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-dark-lighter">
              <span className="text-lg font-semibold text-white">Grand Total</span>
              <span className="text-xl font-bold text-primary">{formatPrice(bill.grandTotal)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Print Preview */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Invoice Preview</h3>
        <div className="bg-white rounded-lg overflow-hidden max-w-sm mx-auto">
          <InvoicePrint ref={invoiceRef} bill={bill} restaurant={restaurant} />
        </div>
      </Card>
    </div>
  );
};

export default BillDetail;