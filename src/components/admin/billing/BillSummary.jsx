// frontend/src/components/admin/billing/BillSummary.jsx
import { useState } from 'react';
import { Percent, Tag, Calculator, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { formatPrice } from '../../../utils/formatters.js';
import Input from '../../common/Input.jsx';
import Button from '../../common/Button.jsx';
import { classNames } from '../../../utils/helpers.js';

const BillSummary = ({ 
  subtotal, 
  discount,
  discountType,
  taxRate,
  onDiscountChange,
  onDiscountTypeChange,
  onGenerateBill,
  isLoading = false
}) => {
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  // Calculate discount amount
  const discountAmount = discountType === 'percentage' 
    ? (subtotal * discount) / 100 
    : discount;

  // Calculate tax
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;

  // Calculate grand total
  const grandTotal = taxableAmount + taxAmount;

  // Calculate change
  const paidValue = parseFloat(amountPaid) || 0;
  const changeAmount = paidValue > grandTotal ? paidValue - grandTotal : 0;

  const handleGenerateBill = () => {
    onGenerateBill({
      amountPaid: paidValue,
      changeAmount,
      paymentMethod,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      tableNumber: tableNumber.trim() || undefined,
      grandTotal
    });
    
    // Reset form after generating bill
    setAmountPaid('');
    setCustomerName('');
    setCustomerPhone('');
    setTableNumber('');
  };

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: Banknote },
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'online', label: 'Online', icon: Smartphone }
  ];

  return (
    <div className="bg-dark-card rounded-xl border border-dark-lighter flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Header */}
        <h3 className="text-lg font-semibold text-white">Bill Summary</h3>

        {/* Customer Info (Collapsible) */}
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer text-text-secondary hover:text-white transition-colors text-sm">
            <span>Customer Info (Optional)</span>
            <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-2 space-y-2">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2 text-white text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2 text-white text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2 text-white text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </details>

        {/* Discount Section */}
        <div className="p-2 bg-dark-lighter rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-3 h-3 text-primary" />
            <span className="text-xs text-text-secondary">Discount</span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="flex-1 bg-dark-card border-none rounded-lg px-2 py-1.5 text-white text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex bg-dark-card rounded-lg overflow-hidden">
              <button
                onClick={() => onDiscountTypeChange('fixed')}
                className={classNames(
                  'px-2 py-1.5 text-xs font-medium transition-colors',
                  discountType === 'fixed' 
                    ? 'bg-primary text-white' 
                    : 'text-text-secondary hover:text-white'
                )}
              >
                Rs.
              </button>
              <button
                onClick={() => onDiscountTypeChange('percentage')}
                className={classNames(
                  'px-2 py-1.5 text-xs font-medium transition-colors',
                  discountType === 'percentage' 
                    ? 'bg-primary text-white' 
                    : 'text-text-secondary hover:text-white'
                )}
              >
                <Percent className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {/* Quick Discount Buttons */}
          <div className="flex gap-1 mt-2">
            {[5, 10, 15, 20].map(pct => (
              <button
                key={pct}
                onClick={() => {
                  onDiscountTypeChange('percentage');
                  onDiscountChange(pct);
                }}
                className="flex-1 px-1 py-1 text-xs bg-dark-card text-text-secondary hover:bg-primary hover:text-white rounded transition-colors"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Calculations */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span className="text-white">{formatPrice(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-500">
              <span>Discount {discountType === 'percentage' ? `(${discount}%)` : ''}</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
          {taxRate > 0 && (
            <div className="flex justify-between text-text-secondary">
              <span>Tax ({taxRate}%)</span>
              <span className="text-white">{formatPrice(taxAmount)}</span>
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="flex justify-between py-2 border-t border-b border-dark-lighter">
          <span className="text-base font-semibold text-white">Grand Total</span>
          <span className="text-xl font-bold text-primary">{formatPrice(grandTotal)}</span>
        </div>

        {/* Payment Method */}
        <div className="p-2 bg-dark-lighter rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-3 h-3 text-primary" />
            <span className="text-xs text-text-secondary">Payment Method</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={classNames(
                  'flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-colors',
                  paymentMethod === method.id
                    ? 'bg-primary text-white'
                    : 'bg-dark-card text-text-secondary hover:text-white'
                )}
              >
                <method.icon className="w-4 h-4" />
                <span className="text-[10px]">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Amount */}
        <div className="p-2 bg-dark-lighter rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-3 h-3 text-primary" />
            <span className="text-xs text-text-secondary">Amount Received</span>
          </div>
          <input
            type="number"
            min="0"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-dark-card border-none rounded-lg px-2 py-1.5 text-white text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {changeAmount > 0 && (
            <div className="flex justify-between mt-2 p-1.5 bg-green-500/10 rounded-lg">
              <span className="text-green-500 text-sm">Change</span>
              <span className="text-green-500 font-bold">{formatPrice(changeAmount)}</span>
            </div>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-1">
          {[100, 500, 1000, 2000].map((amount) => (
            <button
              key={amount}
              onClick={() => setAmountPaid(amount.toString())}
              className="px-1 py-1.5 bg-dark-lighter text-text-secondary hover:bg-dark-card hover:text-white rounded-lg text-xs transition-colors"
            >
              {amount}
            </button>
          ))}
        </div>

        <button
          onClick={() => setAmountPaid(grandTotal.toFixed(0))}
          className="w-full py-1.5 text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
        >
          Exact Amount ({formatPrice(grandTotal)})
        </button>
      </div>

      {/* Fixed Generate Bill Button */}
      <div className="flex-shrink-0 p-3 border-t border-dark-lighter bg-dark-card">
        <Button
          onClick={handleGenerateBill}
          fullWidth
          size="lg"
          isLoading={isLoading}
          disabled={subtotal <= 0}
        >
          Generate Bill
        </Button>
      </div>
    </div>
  );
};

export default BillSummary;