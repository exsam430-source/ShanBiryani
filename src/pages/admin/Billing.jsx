// frontend/src/pages/admin/Billing.jsx
import { useState, useEffect, useRef } from 'react';
import { Download, Share2, Printer, CheckCircle, FileText } from 'lucide-react';
import { billService } from '../../services/billService.js';
import { settingsService } from '../../services/settingsService.js';
import { useToast } from '../../hooks/useToast.js';
import { openThermalPrint, printThermalDirect, downloadReceiptText } from '../../utils/thermalPrint.js';
import { shareInvoicePDF } from '../../utils/pdfGenerator.js';
import POSLayout from '../../components/admin/billing/POSLayout.jsx';
import ThermalInvoice from '../../components/admin/billing/ThermalInvoice.jsx';
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

  // Thermal print - opens in new window optimized for 80mm printer
  const handlePrint = () => {
    if (generatedBill) {
      const success = openThermalPrint(generatedBill, getRestaurantInfo());
      if (success) {
        billService.markAsPrinted(generatedBill._id).catch(console.error);
        showSuccess('Print window opened');
      } else {
        showError('Failed to open print window. Please allow popups.');
      }
    }
  };

  // Direct print (no preview)
  const handleDirectPrint = async () => {
    if (generatedBill) {
      try {
        await printThermalDirect(generatedBill, getRestaurantInfo());
        billService.markAsPrinted(generatedBill._id).catch(console.error);
        showSuccess('Printing...');
      } catch (error) {
        showError('Failed to print');
      }
    }
  };

  // Download as text (for raw thermal printing)
  const handleDownloadText = () => {
    if (generatedBill) {
      const success = downloadReceiptText(generatedBill, getRestaurantInfo());
      if (success) {
        showSuccess('Receipt downloaded');
      } else {
        showError('Failed to download');
      }
    }
  };

  // Share invoice
  const handleShare = async () => {
    if (generatedBill) {
      try {
        const shared = await shareInvoicePDF(generatedBill, getRestaurantInfo());
        if (shared) {
          showSuccess('Invoice shared');
        }
      } catch (error) {
        showError('Failed to share');
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

  // Auto-print option
  const handlePrintAndNew = async () => {
    await handleDirectPrint();
    setTimeout(() => {
      handleNewBill();
    }, 500);
  };

  const taxRate = settings?.taxSettings?.enableTax ? settings.taxSettings.taxRate : 0;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 100px)' }}>
      {/* Header */}
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

      {/* POS Layout */}
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
        size="md"
      >
        <div className="space-y-4">
          {/* Bill Number */}
          <div className="text-center p-3 bg-green-500/10 rounded-lg">
            <p className="text-text-secondary text-sm">Bill Number</p>
            <p className="text-xl font-bold text-green-500">{generatedBill?.billNumber}</p>
          </div>

          {/* Thermal Invoice Preview */}
          <div 
            className="bg-white rounded-lg overflow-y-auto flex justify-center p-4"
            style={{ maxHeight: '50vh' }}
          >
            <ThermalInvoice
              ref={invoiceRef}
              bill={generatedBill}
              restaurant={getRestaurantInfo()}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="primary"
              onClick={handlePrintAndNew}
              leftIcon={<Printer className="w-4 h-4" />}
              className="col-span-2"
            >
              Print & New Bill
            </Button>
          </div>

          {/* Other Actions */}
          <div className="grid grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3 h-3" />}
            >
              Print
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownloadText}
              leftIcon={<Download className="w-3 h-3" />}
            >
              Text
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 className="w-3 h-3" />}
            >
              Share
            </Button>
            <Button 
              size="sm"
              onClick={handleNewBill}
            >
              New
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Billing;