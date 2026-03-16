// frontend/src/pages/admin/Billing.jsx
import { useState, useEffect, useRef } from 'react';
import { Download, Share2, Printer, CheckCircle } from 'lucide-react';
import { billService } from '../../services/billService.js';
import { settingsService } from '../../services/settingsService.js';
import { useToast } from '../../hooks/useToast.js';
import { downloadInvoicePDF, shareInvoicePDF, openPrintWindow } from '../../utils/pdfGenerator.js';
import POSLayout from '../../components/admin/billing/POSLayout.jsx';
import InvoicePrint from '../../components/admin/billing/InvoicePrint.jsx';
import Modal from '../../components/common/Modal.jsx';
import Button from '../../components/common/Button.jsx';

const Billing = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedBill, setGeneratedBill] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const { showSuccess, showError } = useToast();
  const invoiceRef = useRef(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsService.getSettings();
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const getRestaurantInfo = () => ({
    name: settings?.restaurantName || 'Shan Biryani',
    address: settings?.address?.fullAddress || '',
    phone: settings?.contact?.phone || '',
    email: settings?.contact?.email || '',
    footerText: settings?.invoiceSettings?.footerText || 'Thank you for dining with us!'
  });

  const handlePrint = () => {
    if (generatedBill) {
      const success = openPrintWindow(generatedBill, getRestaurantInfo());
      if (success) {
        billService.markAsPrinted(generatedBill._id).catch(console.error);
      } else {
        showError('Failed to open print window');
      }
    }
  };

  const handleDownloadPDF = () => {
    if (generatedBill) {
      const success = downloadInvoicePDF(generatedBill, getRestaurantInfo());
      if (success) {
        showSuccess('Invoice downloaded successfully');
      } else {
        showError('Failed to download invoice');
      }
    }
  };

  const handleSharePDF = async () => {
    if (generatedBill) {
      try {
        const shared = await shareInvoicePDF(generatedBill, getRestaurantInfo());
        if (shared) {
          showSuccess('Invoice shared successfully');
        } else {
          showSuccess('Invoice downloaded (sharing not supported)');
        }
      } catch (error) {
        showError('Failed to share invoice');
      }
    }
  };

  const handleGenerateBill = async (billData) => {
    setIsLoading(true);
    try {
      const response = await billService.createBill({
        ...billData,
        billType: 'counter',
        paymentStatus: billData.amountPaid >= billData.grandTotal ? 'paid' : 'pending'
      });
      
      setGeneratedBill(response.data);
      setShowInvoice(true);
      showSuccess('Bill generated successfully');
    } catch (error) {
      showError(error.message || 'Failed to generate bill');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    setShowInvoice(false);
  };

  const handleNewBill = () => {
    setShowInvoice(false);
    setGeneratedBill(null);
    showSuccess('Ready for new bill');
  };

  const taxRate = settings?.taxSettings?.enableTax ? settings.taxSettings.taxRate : 0;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 100px)' }}>
      {/* Header - Fixed */}
      <div className="flex-shrink-0 flex items-center justify-between mb-3">
        <div>
          <h1 className="text-xl font-bold text-white">Billing (POS)</h1>
          <p className="text-text-secondary text-sm">Create bills for walk-in customers</p>
        </div>
        {generatedBill && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInvoice(true)}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            View Last Bill
          </Button>
        )}
      </div>

      {/* POS Layout - Takes remaining space */}
      <div className="flex-1 overflow-hidden">
        <POSLayout
          onGenerateBill={handleGenerateBill}
          isLoading={isLoading}
          taxRate={taxRate}
        />
      </div>

      {/* Invoice Modal */}
      <Modal
        isOpen={showInvoice}
        onClose={handleCloseAndReset}
        title={
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Bill Generated Successfully</span>
          </div>
        }
        size="lg"
      >
        <div className="space-y-4">
          {/* Bill Number */}
          <div className="text-center p-3 bg-green-500/10 rounded-lg">
            <p className="text-text-secondary text-sm">Bill Number</p>
            <p className="text-xl font-bold text-green-500">{generatedBill?.billNumber}</p>
          </div>

          {/* Invoice Preview */}
          <div 
            className="bg-white rounded-lg overflow-y-auto"
            style={{ maxHeight: '50vh' }}
          >
            <InvoicePrint
              ref={invoiceRef}
              bill={generatedBill}
              restaurant={getRestaurantInfo()}
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDownloadPDF}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSharePDF}
              leftIcon={<Share2 className="w-4 h-4" />}
            >
              Share
            </Button>
            <Button onClick={handleNewBill}>
              New Bill
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Billing;