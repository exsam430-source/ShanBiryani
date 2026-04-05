// frontend/src/utils/thermalPrint.js

/**
 * Thermal Printer Configuration
 * For 80mm thermal printers (SP-200U and similar)
 * Printable width: 72mm (576px at 203 DPI)
 */

const THERMAL_CONFIG = {
  width: '72mm',
  widthPx: 576,
  fontSize: {
    small: '8px',
    normal: '10px',
    medium: '11px',
    large: '13px',
    title: '14px'
  },
  margins: '2mm',
  fontFamily: 'monospace, "Courier New", Courier, "Lucida Console"'
};

/**
 * Generate thermal receipt HTML
 */
export const generateThermalHTML = (bill, restaurant) => {
  if (!bill) return '';

  const discountAmount = bill.discountType === 'percentage'
    ? (bill.subtotal * bill.discount) / 100
    : bill.discountAmount || bill.discount || 0;

  const formatPrice = (price) => `Rs.${(price || 0).toFixed(0)}`;
  
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-PK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getUnitLabel = (unit, qty) => {
    const labels = {
      piece: qty > 1 ? 'pcs' : 'pc', kg: 'kg', gram: 'g', dozen: 'dz',
      plate: 'plt', box: 'box', pack: 'pk', bottle: 'btl', litre: 'L',
      half: 'half', full: 'full', small: 'S', medium: 'M', large: 'L',
      regular: 'reg', family: 'fam', crate: 'crt', bundle: 'bdl'
    };
    return labels[unit] || 'pc';
  };

  const itemsHTML = bill.items?.map(item => `
    <div class="item">
      <div class="item-name">${item.name}${item.notes ? '*' : ''}</div>
      <div class="item-details">
        <span>${item.quantity} ${getUnitLabel(item.unit, item.quantity)} x ${item.price?.toFixed(0)}</span>
        <span class="item-total">${(item.subtotal || item.price * item.quantity)?.toFixed(0)}</span>
      </div>
      ${item.notes ? `<div class="item-note">• ${item.notes}</div>` : ''}
    </div>
  `).join('') || '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt - ${bill.billNumber}</title>
  <style>
    @page {
      size: 72mm auto;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: 72mm;
      max-width: 72mm;
      margin: 0 auto;
      padding: 2mm;
      font-family: ${THERMAL_CONFIG.fontFamily};
      font-size: ${THERMAL_CONFIG.fontSize.medium};
      line-height: 1.3;
      color: #000;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .header {
      text-align: center;
      border-bottom: 1px dashed #000;
      padding-bottom: 2mm;
      margin-bottom: 2mm;
    }
    
    .restaurant-name {
      font-size: ${THERMAL_CONFIG.fontSize.title};
      font-weight: bold;
      margin-bottom: 1mm;
    }
    
    .restaurant-info {
      font-size: ${THERMAL_CONFIG.fontSize.small};
    }
    
    .invoice-info {
      text-align: center;
      padding: 2mm 0;
      border-bottom: 1px dashed #000;
      margin-bottom: 2mm;
    }
    
    .invoice-title {
      font-size: ${THERMAL_CONFIG.fontSize.large};
      font-weight: bold;
    }
    
    .invoice-number {
      font-size: ${THERMAL_CONFIG.fontSize.normal};
    }
    
    .invoice-date {
      font-size: ${THERMAL_CONFIG.fontSize.small};
    }
    
    .customer-info {
      font-size: ${THERMAL_CONFIG.fontSize.normal};
      padding-bottom: 2mm;
      margin-bottom: 2mm;
      border-bottom: 1px dashed #000;
    }
    
    .items-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: ${THERMAL_CONFIG.fontSize.normal};
      border-bottom: 1px solid #000;
      padding-bottom: 1mm;
      margin-bottom: 1mm;
    }
    
    .item {
      margin-bottom: 2mm;
      font-size: ${THERMAL_CONFIG.fontSize.normal};
    }
    
    .item-name {
      font-weight: bold;
    }
    
    .item-details {
      display: flex;
      justify-content: space-between;
      padding-left: 2mm;
      font-size: ${THERMAL_CONFIG.fontSize.small};
      color: #333;
    }
    
    .item-total {
      font-weight: bold;
    }
    
    .item-note {
      font-size: ${THERMAL_CONFIG.fontSize.small};
      color: #666;
      padding-left: 2mm;
      font-style: italic;
    }
    
    .divider {
      border-top: 1px dashed #000;
      margin: 2mm 0;
    }
    
    .totals {
      margin-top: 2mm;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1mm;
      font-size: ${THERMAL_CONFIG.fontSize.normal};
    }
    
    .grand-total {
      display: flex;
      justify-content: space-between;
      font-size: ${THERMAL_CONFIG.fontSize.large};
      font-weight: bold;
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
      padding: 2mm 0;
      margin: 2mm 0;
    }
    
    .payment-info {
      font-size: ${THERMAL_CONFIG.fontSize.normal};
      margin-top: 2mm;
      padding-top: 2mm;
      border-top: 1px dashed #000;
    }
    
    .payment-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1mm;
    }
    
    .footer {
      text-align: center;
      margin-top: 3mm;
      padding-top: 2mm;
      border-top: 1px dashed #000;
    }
    
    .footer-text {
      font-weight: bold;
      font-size: ${THERMAL_CONFIG.fontSize.normal};
      margin-bottom: 1mm;
    }
    
    .small-text {
      font-size: ${THERMAL_CONFIG.fontSize.small};
      color: #666;
    }
    
    .discount {
      color: #000;
    }
    
    .capitalize {
      text-transform: capitalize;
    }

    @media print {
      body {
        width: 72mm;
        max-width: 72mm;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div class="restaurant-name">${restaurant?.name || 'Shan Biryani'}</div>
    ${restaurant?.address ? `<div class="restaurant-info">${restaurant.address}</div>` : ''}
    ${restaurant?.phone ? `<div class="restaurant-info">Tel: ${restaurant.phone}</div>` : ''}
  </div>
  
  <!-- Invoice Info -->
  <div class="invoice-info">
    <div class="invoice-title">INVOICE</div>
    <div class="invoice-number">#${bill.billNumber}</div>
    <div class="invoice-date">${formatDate(bill.createdAt)}</div>
  </div>
  
  <!-- Customer Info -->
  ${(bill.customerName || bill.tableNumber || bill.customerPhone) ? `
    <div class="customer-info">
      ${bill.customerName ? `<div>Customer: ${bill.customerName}</div>` : ''}
      ${bill.customerPhone ? `<div>Phone: ${bill.customerPhone}</div>` : ''}
      ${bill.tableNumber ? `<div>Table: ${bill.tableNumber}</div>` : ''}
      <div>Type: ${(bill.billType || 'counter').toUpperCase()}</div>
    </div>
  ` : ''}
  
  <!-- Items Header -->
  <div class="items-header">
    <span>Item</span>
    <span>Amt</span>
  </div>
  
  <!-- Items -->
  ${itemsHTML}
  
  <div class="divider"></div>
  
  <!-- Totals -->
  <div class="totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>${formatPrice(bill.subtotal)}</span>
    </div>
    ${discountAmount > 0 ? `
      <div class="total-row discount">
        <span>Discount${bill.discountType === 'percentage' ? ` (${bill.discount}%)` : ''}:</span>
        <span>-${formatPrice(discountAmount)}</span>
      </div>
    ` : ''}
    ${bill.taxAmount > 0 ? `
      <div class="total-row">
        <span>Tax (${bill.taxRate}%):</span>
        <span>${formatPrice(bill.taxAmount)}</span>
      </div>
    ` : ''}
  </div>
  
  <!-- Grand Total -->
  <div class="grand-total">
    <span>TOTAL:</span>
    <span>${formatPrice(bill.grandTotal)}</span>
  </div>
  
  <!-- Payment Info -->
  <div class="payment-info">
    <div class="payment-row">
      <span>Payment:</span>
      <span class="capitalize">${bill.paymentMethod || 'Cash'}</span>
    </div>
    <div class="payment-row">
      <span>Status:</span>
      <span class="capitalize" style="font-weight:bold">${bill.paymentStatus || 'Paid'}</span>
    </div>
    ${bill.amountPaid > 0 ? `
      <div class="payment-row">
        <span>Received:</span>
        <span>${formatPrice(bill.amountPaid)}</span>
      </div>
      ${bill.changeAmount > 0 ? `
        <div class="payment-row">
          <span>Change:</span>
          <span>${formatPrice(bill.changeAmount)}</span>
        </div>
      ` : ''}
    ` : ''}
  </div>
  
  <!-- Footer -->
  <div class="footer">
    <div class="footer-text">${restaurant?.footerText || 'Thank you!'}</div>
    <div class="small-text">Please Come Again</div>
    ${bill.createdBy?.name ? `<div class="small-text" style="margin-top:1mm">Served by: ${bill.createdBy.name}</div>` : ''}
  </div>
  
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 200);
    };
  </script>
</body>
</html>
  `;
};

/**
 * Open thermal print window
 */
export const openThermalPrint = (bill, restaurant) => {
  try {
    const html = generateThermalHTML(bill, restaurant);
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    
    if (!printWindow) {
      console.error('Popup blocked');
      return false;
    }
    
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    
    return true;
  } catch (error) {
    console.error('Print error:', error);
    return false;
  }
};

/**
 * Direct print without preview (for thermal printers)
 */
export const printThermalDirect = (bill, restaurant) => {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.left = '-9999px';
    
    document.body.appendChild(iframe);
    
    const html = generateThermalHTML(bill, restaurant);
    
    iframe.contentDocument.open();
    iframe.contentDocument.write(html.replace(
      'window.print();',
      `
        window.print();
        window.onafterprint = function() {
          window.parent.postMessage('printComplete', '*');
        };
      `
    ));
    iframe.contentDocument.close();
    
    const handleMessage = (event) => {
      if (event.data === 'printComplete') {
        document.body.removeChild(iframe);
        window.removeEventListener('message', handleMessage);
        resolve(true);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Fallback cleanup after 30 seconds
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
        window.removeEventListener('message', handleMessage);
        resolve(true);
      }
    }, 30000);
  });
};

/**
 * Download receipt as text file (for thermal printers that support text)
 */
export const downloadReceiptText = (bill, restaurant) => {
  const line = ''.padStart(32, '-');
  const doubleLine = ''.padStart(32, '=');
  
  const center = (text, width = 32) => {
    const padding = Math.floor((width - text.length) / 2);
    return ''.padStart(padding) + text;
  };
  
  const leftRight = (left, right, width = 32) => {
    const space = width - left.length - right.length;
    return left + ''.padStart(space) + right;
  };
  
  const formatPrice = (price) => `Rs.${(price || 0).toFixed(0)}`;
  
  let receipt = '';
  
  // Header
  receipt += center(restaurant?.name || 'Shan Biryani') + '\n';
  if (restaurant?.address) receipt += center(restaurant.address) + '\n';
  if (restaurant?.phone) receipt += center(`Tel: ${restaurant.phone}`) + '\n';
  receipt += line + '\n';
  
  // Invoice info
  receipt += center('INVOICE') + '\n';
  receipt += center(`#${bill.billNumber}`) + '\n';
  receipt += center(new Date(bill.createdAt).toLocaleString()) + '\n';
  receipt += line + '\n';
  
  // Customer
  if (bill.customerName) receipt += `Customer: ${bill.customerName}\n`;
  if (bill.tableNumber) receipt += `Table: ${bill.tableNumber}\n`;
  if (bill.customerName || bill.tableNumber) receipt += line + '\n';
  
  // Items
  bill.items?.forEach(item => {
    receipt += `${item.name}\n`;
    receipt += leftRight(
      `  ${item.quantity}x${item.price}`,
      `${(item.subtotal || item.price * item.quantity).toFixed(0)}`
    ) + '\n';
  });
  
  receipt += line + '\n';
  
  // Totals
  receipt += leftRight('Subtotal:', formatPrice(bill.subtotal)) + '\n';
  
  if (bill.discountAmount > 0) {
    receipt += leftRight('Discount:', `-${formatPrice(bill.discountAmount)}`) + '\n';
  }
  
  if (bill.taxAmount > 0) {
    receipt += leftRight(`Tax(${bill.taxRate}%):`, formatPrice(bill.taxAmount)) + '\n';
  }
  
  receipt += doubleLine + '\n';
  receipt += leftRight('TOTAL:', formatPrice(bill.grandTotal)) + '\n';
  receipt += doubleLine + '\n';
  
  // Payment
  receipt += leftRight('Payment:', bill.paymentMethod?.toUpperCase() || 'CASH') + '\n';
  receipt += leftRight('Status:', bill.paymentStatus?.toUpperCase() || 'PAID') + '\n';
  
  if (bill.amountPaid > 0) {
    receipt += leftRight('Received:', formatPrice(bill.amountPaid)) + '\n';
    if (bill.changeAmount > 0) {
      receipt += leftRight('Change:', formatPrice(bill.changeAmount)) + '\n';
    }
  }
  
  receipt += line + '\n';
  
  // Footer
  receipt += center(restaurant?.footerText || 'Thank you!') + '\n';
  receipt += center('Please Come Again') + '\n';
  receipt += '\n\n\n'; // Feed for cutting
  
  // Download
  const blob = new Blob([receipt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt_${bill.billNumber}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  
  return true;
};

export default {
  generateThermalHTML,
  openThermalPrint,
  printThermalDirect,
  downloadReceiptText,
  config: THERMAL_CONFIG
};