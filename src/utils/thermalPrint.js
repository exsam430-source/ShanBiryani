// frontend/src/utils/thermalPrint.js

/**
 * Optimized for SPEED X SP-200W 80mm Thermal Printer
 * Paper: 80mm width, 71.1mm printable area
 * Resolution: 203 DPI
 */

const THERMAL_CONFIG = {
  // Actual printable width for 80mm thermal (accounting for margins)
  printableWidth: '68mm', // Safe printable area
  paperWidth: '80mm',
  // Increased font sizes for better readability
  fontSize: {
    small: '9px',
    normal: '11px',
    medium: '12px',
    large: '15px',
    title: '16px',
    itemName: '13px',  // Bigger item names
    itemPrice: '14px'  // Bigger prices
  },
  margins: '1mm',
  fontFamily: '"Courier New", Courier, monospace, "Consolas"'
};

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

export const generateThermalHTML = (bill, restaurant) => {
  if (!bill) return '';

  const discountAmount = bill.discountType === 'percentage'
    ? (bill.subtotal * bill.discount) / 100
    : bill.discountAmount || bill.discount || 0;

  const itemsHTML = bill.items?.map(item => `
    <div class="item">
      <div class="item-name">${item.name}${item.notes ? ' *' : ''}</div>
      <div class="item-details">
        <span class="qty-price">${item.quantity} ${getUnitLabel(item.unit, item.quantity)} x Rs.${item.price?.toFixed(0)}</span>
        <span class="item-total">Rs.${(item.subtotal || item.price * item.quantity)?.toFixed(0)}</span>
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
    /* Critical: Proper page setup for 80mm thermal printer */
    @page {
      size: 80mm auto;
      margin: 0;
    }
    
    @media print {
      html, body {
        width: 80mm;
        margin: 0;
        padding: 0;
      }
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: ${THERMAL_CONFIG.printableWidth};
      max-width: ${THERMAL_CONFIG.printableWidth};
      margin: 0 auto;
      padding: ${THERMAL_CONFIG.margins} 3mm;
      font-family: ${THERMAL_CONFIG.fontFamily};
      font-size: ${THERMAL_CONFIG.fontSize.normal};
      line-height: 1.4;
      color: #000;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    /* Header */
    .header {
      text-align: center;
      border-bottom: 1px dashed #000;
      padding-bottom: 3mm;
      margin-bottom: 3mm;
    }
    
    .restaurant-name {
      font-size: ${THERMAL_CONFIG.fontSize.title};
      font-weight: bold;
      margin-bottom: 1.5mm;
      letter-spacing: 0.5px;
    }
    
    .restaurant-info {
      font-size: ${THERMAL_CONFIG.fontSize.small};
      line-height: 1.3;
    }
    
    /* Invoice Info */
    .invoice-info {
      text-align: center;
      padding: 2.5mm 0;
      border-bottom: 1px dashed #000;
      margin-bottom: 3mm;
    }
    
    .invoice-title {
      font-size: ${THERMAL_CONFIG.fontSize.large};
      font-weight: bold;
      margin-bottom: 1mm;
    }
    
    .invoice-number {
      font-size: ${THERMAL_CONFIG.fontSize.medium};
      font-weight: bold;
    }
    
    .invoice-date {
      font-size: ${THERMAL_CONFIG.fontSize.small};
      margin-top: 0.5mm;
    }
    
    /* Customer Info */
    .customer-info {
      font-size: ${THERMAL_CONFIG.fontSize.normal};
      padding-bottom: 2.5mm;
      margin-bottom: 2.5mm;
      border-bottom: 1px dashed #000;
      line-height: 1.5;
    }
    
    /* Items Header */
    .items-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: ${THERMAL_CONFIG.fontSize.medium};
      border-bottom: 1px solid #000;
      padding-bottom: 1.5mm;
      margin-bottom: 2mm;
    }
    
    /* Items - BIGGER FONTS */
    .item {
      margin-bottom: 3mm;
      border-bottom: 1px dotted #ccc;
      padding-bottom: 2mm;
    }
    
    .item:last-child {
      border-bottom: none;
    }
    
    .item-name {
      font-weight: bold;
      font-size: ${THERMAL_CONFIG.fontSize.itemName};
      margin-bottom: 1mm;
      line-height: 1.3;
    }
    
    .item-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 2mm;
      font-size: ${THERMAL_CONFIG.fontSize.normal};
    }
    
    .qty-price {
      color: #333;
      font-size: ${THERMAL_CONFIG.fontSize.normal};
    }
    
    .item-total {
      font-weight: bold;
      font-size: ${THERMAL_CONFIG.fontSize.itemPrice};
    }
    
    .item-note {
      font-size: ${THERMAL_CONFIG.fontSize.small};
      color: #666;
      padding-left: 4mm;
      margin-top: 1mm;
      font-style: italic;
    }
    
    /* Divider */
    .divider {
      border-top: 1px dashed #000;
      margin: 3mm 0;
    }
    
    /* Totals */
    .totals {
      margin-top: 3mm;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.5mm;
      font-size: ${THERMAL_CONFIG.fontSize.medium};
      line-height: 1.4;
    }
    
    .total-row.discount {
      color: #000;
      font-weight: 500;
    }
    
    /* Grand Total - BIGGER */
    .grand-total {
      display: flex;
      justify-content: space-between;
      font-size: ${THERMAL_CONFIG.fontSize.large};
      font-weight: bold;
      border-top: 2px solid #000;
      border-bottom: 2px solid #000;
      padding: 3mm 0;
      margin: 3mm 0;
    }
    
    /* Payment Info */
    .payment-info {
      font-size: ${THERMAL_CONFIG.fontSize.medium};
      margin-top: 3mm;
      padding-top: 3mm;
      border-top: 1px dashed #000;
    }
    
    .payment-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.5mm;
      line-height: 1.4;
    }
    
    .payment-row .value {
      font-weight: bold;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      margin-top: 4mm;
      padding-top: 3mm;
      border-top: 1px dashed #000;
    }
    
    .footer-text {
      font-weight: bold;
      font-size: ${THERMAL_CONFIG.fontSize.medium};
      margin-bottom: 2mm;
    }
    
    .small-text {
      font-size: ${THERMAL_CONFIG.fontSize.small};
      color: #666;
      margin-top: 1mm;
    }
    
    .capitalize {
      text-transform: capitalize;
    }

    /* Print-specific adjustments */
    @media print {
      body {
        width: 80mm !important;
        max-width: 80mm !important;
      }
      
      .no-print {
        display: none !important;
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
      ${bill.customerName ? `<div>Customer: <strong>${bill.customerName}</strong></div>` : ''}
      ${bill.customerPhone ? `<div>Phone: ${bill.customerPhone}</div>` : ''}
      ${bill.tableNumber ? `<div>Table: <strong>${bill.tableNumber}</strong></div>` : ''}
      <div>Type: <strong>${(bill.billType || 'counter').toUpperCase()}</strong></div>
    </div>
  ` : ''}
  
  <!-- Items Header -->
  <div class="items-header">
    <span>Item</span>
    <span>Amount</span>
  </div>
  
  <!-- Items -->
  ${itemsHTML}
  
  <div class="divider"></div>
  
  <!-- Totals -->
  <div class="totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span><strong>${formatPrice(bill.subtotal)}</strong></span>
    </div>
    ${discountAmount > 0 ? `
      <div class="total-row discount">
        <span>Discount${bill.discountType === 'percentage' ? ` (${bill.discount}%)` : ''}:</span>
        <span><strong>-${formatPrice(discountAmount)}</strong></span>
      </div>
    ` : ''}
    ${bill.taxAmount > 0 ? `
      <div class="total-row">
        <span>Tax (${bill.taxRate}%):</span>
        <span><strong>${formatPrice(bill.taxAmount)}</strong></span>
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
      <span class="value capitalize">${bill.paymentMethod || 'Cash'}</span>
    </div>
    <div class="payment-row">
      <span>Status:</span>
      <span class="value capitalize">${bill.paymentStatus || 'Paid'}</span>
    </div>
    ${bill.amountPaid > 0 ? `
      <div class="payment-row">
        <span>Received:</span>
        <span class="value">${formatPrice(bill.amountPaid)}</span>
      </div>
      ${bill.changeAmount > 0 ? `
        <div class="payment-row">
          <span>Change:</span>
          <span class="value">${formatPrice(bill.changeAmount)}</span>
        </div>
      ` : ''}
    ` : ''}
  </div>
  
  <!-- Footer -->
  <div class="footer">
    <div class="footer-text">${restaurant?.footerText || 'Thank you!'}</div>
    <div class="small-text">Please Come Again</div>
    ${bill.createdBy?.name ? `<div class="small-text">Served by: ${bill.createdBy.name}</div>` : ''}
  </div>
  
  <script>
    // Auto-print after load
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 250);
    };
    
    // Close after print
    window.onafterprint = function() {
      setTimeout(function() {
        window.close();
      }, 100);
    };
  </script>
</body>
</html>
  `;
};

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
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
    
    const handleMessage = (event) => {
      if (event.data === 'printComplete') {
        document.body.removeChild(iframe);
        window.removeEventListener('message', handleMessage);
        resolve(true);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
        window.removeEventListener('message', handleMessage);
        resolve(true);
      }
    }, 30000);
  });
};

export const downloadReceiptText = (bill, restaurant) => {
  const WIDTH = 32;
  const line = '='.repeat(WIDTH);
  const dashLine = '-'.repeat(WIDTH);
  
  const center = (text) => {
    const padding = Math.floor((WIDTH - text.length) / 2);
    return ' '.repeat(Math.max(0, padding)) + text;
  };
  
  const leftRight = (left, right) => {
    const space = WIDTH - left.length - right.length;
    return left + ' '.repeat(Math.max(1, space)) + right;
  };
  
  let receipt = '\n';
  receipt += center(restaurant?.name || 'Shan Biryani') + '\n';
  if (restaurant?.address) receipt += center(restaurant.address) + '\n';
  if (restaurant?.phone) receipt += center(`Tel: ${restaurant.phone}`) + '\n';
  receipt += line + '\n';
  receipt += center('INVOICE') + '\n';
  receipt += center(`#${bill.billNumber}`) + '\n';
  receipt += center(formatDate(bill.createdAt)) + '\n';
  receipt += line + '\n';
  
  if (bill.customerName || bill.tableNumber) {
    if (bill.customerName) receipt += `Customer: ${bill.customerName}\n`;
    if (bill.tableNumber) receipt += `Table: ${bill.tableNumber}\n`;
    receipt += dashLine + '\n';
  }
  
  bill.items?.forEach(item => {
    receipt += `${item.name}\n`;
    receipt += leftRight(
      ` ${item.quantity}x${item.price}`,
      `${(item.subtotal || item.price * item.quantity).toFixed(0)}`
    ) + '\n';
  });
  
  receipt += line + '\n';
  receipt += leftRight('Subtotal:', formatPrice(bill.subtotal)) + '\n';
  
  if (bill.discountAmount > 0) {
    receipt += leftRight('Discount:', `-${formatPrice(bill.discountAmount)}`) + '\n';
  }
  
  if (bill.taxAmount > 0) {
    receipt += leftRight(`Tax(${bill.taxRate}%):`, formatPrice(bill.taxAmount)) + '\n';
  }
  
  receipt += line + '\n';
  receipt += leftRight('TOTAL:', formatPrice(bill.grandTotal)) + '\n';
  receipt += line + '\n';
  receipt += leftRight('Payment:', (bill.paymentMethod || 'CASH').toUpperCase()) + '\n';
  
  if (bill.amountPaid > 0) {
    receipt += leftRight('Received:', formatPrice(bill.amountPaid)) + '\n';
    if (bill.changeAmount > 0) {
      receipt += leftRight('Change:', formatPrice(bill.changeAmount)) + '\n';
    }
  }
  
  receipt += dashLine + '\n';
  receipt += center(restaurant?.footerText || 'Thank you!') + '\n';
  receipt += center('Please Come Again') + '\n';
  receipt += '\n\n\n';
  
  const blob = new Blob([receipt], { type: 'text/plain;charset=utf-8' });
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