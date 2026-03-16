// frontend/src/components/admin/billing/InvoicePrint.jsx
import { forwardRef } from 'react';
import { formatPrice, formatDateTime } from '../../../utils/formatters.js';

const getUnitLabel = (unit, quantity) => {
  const labels = {
    piece: quantity > 1 ? 'Pcs' : 'Pc',
    kg: 'Kg',
    gram: 'g',
    dozen: 'Dz',
    plate: quantity > 1 ? 'Plates' : 'Plate',
    box: quantity > 1 ? 'Boxes' : 'Box',
    pack: quantity > 1 ? 'Packs' : 'Pack',
    bottle: quantity > 1 ? 'Bottles' : 'Bottle',
    litre: 'L',
    half: 'Half',
    full: 'Full',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    regular: 'Regular',
    family: 'Family',
    crate: quantity > 1 ? 'Crates' : 'Crate',
    bundle: quantity > 1 ? 'Bundles' : 'Bundle'
  };
  return labels[unit] || unit || 'Pc';
};

const InvoicePrint = forwardRef(({ bill, restaurant }, ref) => {
  if (!bill) return null;

  const discountAmount = bill.discountType === 'percentage'
    ? (bill.subtotal * bill.discount) / 100
    : bill.discountAmount || bill.discount || 0;

  return (
    <div ref={ref} className="bg-white text-black p-6 max-w-[300px] mx-auto font-mono text-sm">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">{restaurant?.name || 'Shan Biryani'}</h1>
        {restaurant?.address && (
          <p className="text-xs mt-1">{restaurant.address}</p>
        )}
        {restaurant?.phone && (
          <p className="text-xs">Tel: {restaurant.phone}</p>
        )}
      </div>

      <div className="border-t border-b border-dashed border-gray-400 py-2 mb-4 text-center">
        <p className="font-bold text-base">INVOICE</p>
        <p className="text-xs">#{bill.billNumber}</p>
        <p className="text-xs">{formatDateTime(bill.createdAt)}</p>
      </div>

      {/* Customer Info */}
      {(bill.customerName || bill.tableNumber || bill.customerPhone) && (
        <div className="mb-4 text-xs border-b border-dashed border-gray-300 pb-2">
          {bill.customerName && <p>Customer: {bill.customerName}</p>}
          {bill.customerPhone && <p>Phone: {bill.customerPhone}</p>}
          {bill.tableNumber && <p>Table: {bill.tableNumber}</p>}
        </div>
      )}

      {/* Items */}
      <div className="mb-4">
        <div className="flex justify-between border-b border-gray-300 pb-1 mb-2 text-xs font-bold">
          <span className="flex-1">Item</span>
          <span className="w-16 text-center">Qty</span>
          <span className="w-14 text-right">Rate</span>
          <span className="w-16 text-right">Total</span>
        </div>
        {bill.items?.map((item, index) => (
          <div key={index} className="text-xs mb-1">
            <div className="flex justify-between">
              <span className="flex-1 truncate pr-1">
                {item.name}
                {item.notes && <span className="text-gray-500">*</span>}
              </span>
              <span className="w-16 text-center">
                {item.quantity} {getUnitLabel(item.unit, item.quantity)}
              </span>
              <span className="w-14 text-right">{item.price?.toFixed(0)}</span>
              <span className="w-16 text-right">
                {(item.subtotal || item.price * item.quantity)?.toFixed(0)}
              </span>
            </div>
            {item.notes && (
              <p className="text-[10px] text-gray-500 pl-2">• {item.notes}</p>
            )}
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-dashed border-gray-400 pt-2 space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>Rs. {bill.subtotal?.toFixed(0) || '0'}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>
              Discount
              {bill.discountType === 'percentage' && ` (${bill.discount}%)`}:
            </span>
            <span>-Rs. {discountAmount?.toFixed(0)}</span>
          </div>
        )}
        {bill.taxAmount > 0 && (
          <div className="flex justify-between">
            <span>Tax ({bill.taxRate}%):</span>
            <span>Rs. {bill.taxAmount?.toFixed(0)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base border-t border-gray-300 pt-2 mt-2">
          <span>TOTAL:</span>
          <span>Rs. {bill.grandTotal?.toFixed(0) || '0'}</span>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mt-4 pt-2 border-t border-dashed border-gray-400 text-xs">
        <div className="flex justify-between">
          <span>Payment:</span>
          <span className="capitalize">{bill.paymentMethod || 'Cash'}</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="capitalize font-semibold">
            {bill.paymentStatus || 'Paid'}
          </span>
        </div>
        {bill.amountPaid > 0 && (
          <>
            <div className="flex justify-between mt-1">
              <span>Received:</span>
              <span>Rs. {bill.amountPaid?.toFixed(0)}</span>
            </div>
            {bill.changeAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Change:</span>
                <span>Rs. {bill.changeAmount?.toFixed(0)}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-dashed border-gray-400 text-center text-xs">
        <p className="font-bold">
          {restaurant?.footerText || 'Thank you for dining with us!'}
        </p>
        <p className="mt-2 text-gray-500">Please Come Again</p>
      </div>
    </div>
  );
});

// Add display name for debugging
InvoicePrint.displayName = 'InvoicePrint';

export default InvoicePrint;