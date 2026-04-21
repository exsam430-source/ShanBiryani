// frontend/src/utils/thermalPrint.js

/**
 * Optimized for SPEED X SP-200U 80mm Thermal Printer
 * Paper: 80mm width, 72mm printable area
 * Print width: 72mm (576 dots at 203 DPI)
 */

const THERMAL_CONFIG = {
  printableWidth: '76mm',
  paperWidth: '80mm',
  fontSize: {
    small: '11px',
    normal: '13px',
    medium: '14px',
    large: '16px',
    title: '18px',
    itemName: '15px',
    itemPrice: '15px',
    secondary: '12px'
  },
  margins: '0mm',
  fontFamily: '"Courier New", Courier, monospace'
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
      ${item.notes ? `<div class="item-note">* ${item.notes}</div>` : ''}
    </div>
  `).join('') || '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${bill.billNumber}</title>
  <style>
    @page {
      size: 80mm auto;
      margin: 0mm;
    }

    @media print {
      html, body {
        width: 80mm !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 80mm;
      max-width: 80mm;
      margin: 0;
      padding: 2mm 4mm;
      font-family: "Courier New", Courier, monospace;
      font-size: 13px;
      line-height: 1.5;
      color: #000;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ===== HEADER ===== */
    .header {
      text-align: center;
      border-bottom: 2px dashed #000;
      padding-bottom: 4mm;
      margin-bottom: 4mm;
      width: 100%;
    }

    .restaurant-name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 2mm;
      letter-spacing: 0.5px;
      display: block;
      width: 100%;
    }

    .restaurant-info {
      font-size: 12px;
      font-weight: bold;
      line-height: 1.6;
      display: block;
      width: 100%;
      color: #000;
    }

    /* ===== INVOICE INFO ===== */
    .invoice-info {
      text-align: center;
      padding: 3mm 0;
      border-bottom: 2px dashed #000;
      margin-bottom: 4mm;
      width: 100%;
    }

    .invoice-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 1.5mm;
    }

    .invoice-number {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 1mm;
    }

    .invoice-date {
      font-size: 12px;
      font-weight: bold;
      color: #000;
    }

    /* ===== CUSTOMER INFO ===== */
    .customer-info {
      font-size: 13px;
      font-weight: bold;
      padding-bottom: 3mm;
      margin-bottom: 3mm;
      border-bottom: 2px dashed #000;
      line-height: 1.8;
      width: 100%;
    }

    /* ===== ITEMS HEADER ===== */
    .items-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 14px;
      border-bottom: 2px solid #000;
      padding-bottom: 2mm;
      margin-bottom: 3mm;
      width: 100%;
    }

    /* ===== ITEMS ===== */
    .item {
      margin-bottom: 4mm;
      padding-bottom: 3mm;
      border-bottom: 1px dashed #000;
      width: 100%;
    }

    .item:last-child {
      border-bottom: none;
    }

    .item-name {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 1.5mm;
      line-height: 1.3;
      display: block;
      width: 100%;
    }

    .item-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 2mm;
      width: 100%;
    }

    .qty-price {
      font-size: 13px;
      font-weight: bold;
      color: #000;
    }

    .item-total {
      font-weight: bold;
      font-size: 15px;
      color: #000;
    }

    .item-note {
      font-size: 11px;
      font-weight: bold;
      color: #000;
      padding-left: 4mm;
      margin-top: 1mm;
    }

    /* ===== DIVIDER ===== */
    .divider {
      border-top: 2px dashed #000;
      margin: 4mm 0;
      width: 100%;
    }

    /* ===== TOTALS ===== */
    .totals {
      margin-top: 3mm;
      width: 100%;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2mm;
      font-size: 13px;
      font-weight: bold;
      line-height: 1.5;
      width: 100%;
    }

    .total-row span:first-child {
      color: #000;
    }

    /* ===== GRAND TOTAL ===== */
    .grand-total {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      font-weight: bold;
      border-top: 3px solid #000;
      border-bottom: 3px solid #000;
      padding: 3mm 0;
      margin: 4mm 0;
      width: 100%;
    }

    /* ===== PAYMENT INFO ===== */
    .payment-info {
      font-size: 13px;
      font-weight: bold;
      margin-top: 3mm;
      padding-top: 3mm;
      border-top: 2px dashed #000;
      width: 100%;
    }

    .payment-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2mm;
      line-height: 1.6;
      width: 100%;
    }

    .payment-row .label {
      color: #000;
      font-weight: bold;
    }

    .payment-row .value {
      font-weight: bold;
      color: #000;
    }

    /* ===== FOOTER ===== */
    .footer {
      text-align: center;
      margin-top: 5mm;
      padding-top: 4mm;
      border-top: 2px dashed #000;
      width: 100%;
      padding-bottom: 4mm;
    }

    .footer-text {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 2mm;
      display: block;
    }

    .footer-sub {
      font-size: 13px;
      font-weight: bold;
      color: #000;
      display: block;
      margin-top: 1mm;
    }

    .served-by {
      font-size: 12px;
      font-weight: bold;
      color: #000;
      display: block;
      margin-top: 2mm;
    }

    .capitalize {
      text-transform: capitalize;
    }

    @media print {
      body {
        width: 80mm !important;
        max-width: 80mm !important;
        padding: 2mm 4mm !important;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <span class="restaurant-name">${restaurant?.name || 'Shan Biryani'}</span>
    ${restaurant?.address ? `<span class="restaurant-info">${restaurant.address}</span>` : ''}
    ${restaurant?.phone ? `<span class="restaurant-info">Tel: ${restaurant.phone}</span>` : ''}
  </div>

  <!-- INVOICE INFO -->
  <div class="invoice-info">
    <div class="invoice-title">INVOICE</div>
    <div class="invoice-number">#${bill.billNumber}</div>
    <div class="invoice-date">${formatDate(bill.createdAt)}</div>
  </div>

  <!-- CUSTOMER INFO -->
  ${(bill.customerName || bill.tableNumber || bill.customerPhone) ? `
    <div class="customer-info">
      ${bill.customerName ? `<div>Customer: ${bill.customerName}</div>` : ''}
      ${bill.customerPhone ? `<div>Phone: ${bill.customerPhone}</div>` : ''}
      ${bill.tableNumber ? `<div>Table: ${bill.tableNumber}</div>` : ''}
      <div>Type: ${(bill.billType || 'counter').toUpperCase()}</div>
    </div>
  ` : ''}

  <!-- ITEMS HEADER -->
  <div class="items-header">
    <span>Item</span>
    <span>Amount</span>
  </div>

  <!-- ITEMS -->
  ${itemsHTML}

  <div class="divider"></div>

  <!-- TOTALS -->
  <div class="totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>${formatPrice(bill.subtotal)}</span>
    </div>
    ${discountAmount > 0 ? `
      <div class="total-row">
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

  <!-- GRAND TOTAL -->
  <div class="grand-total">
    <span>TOTAL:</span>
    <span>${formatPrice(bill.grandTotal)}</span>
  </div>

  <!-- PAYMENT INFO -->
  <div class="payment-info">
    <div class="payment-row">
      <span class="label">Payment:</span>
      <span class="value capitalize">${bill.paymentMethod || 'Cash'}</span>
    </div>
    <div class="payment-row">
      <span class="label">Status:</span>
      <span class="value capitalize">${bill.paymentStatus || 'Paid'}</span>
    </div>
    ${bill.amountPaid > 0 ? `
      <div class="payment-row">
        <span class="label">Received:</span>
        <span class="value">${formatPrice(bill.amountPaid)}</span>
      </div>
      ${bill.changeAmount > 0 ? `
        <div class="payment-row">
          <span class="label">Change:</span>
          <span class="value">${formatPrice(bill.changeAmount)}</span>
        </div>
      ` : ''}
    ` : ''}
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <span class="footer-text">${restaurant?.footerText || 'Thank you for dining with us!'}</span>
    <span class="footer-sub">Please Come Again</span>
    ${bill.createdBy?.name ? `<span class="served-by">Served by: ${bill.createdBy.name}</span>` : ''}
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
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
    const printWindow = window.open('', '_blank', 'width=420,height=700');

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
  const WIDTH = 40;
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
  receipt += center(new Date(bill.createdAt).toLocaleString()) + '\n';
  receipt += line + '\n';

  if (bill.customerName || bill.tableNumber) {
    if (bill.customerName) receipt += `Customer: ${bill.customerName}\n`;
    if (bill.tableNumber) receipt += `Table: ${bill.tableNumber}\n`;
    receipt += dashLine + '\n';
  }

  bill.items?.forEach(item => {
    receipt += `${item.name}\n`;
    receipt += leftRight(
      `  ${item.quantity}x Rs.${item.price}`,
      `Rs.${(item.subtotal || item.price * item.quantity).toFixed(0)}`
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
  receipt += leftRight('Status:', (bill.paymentStatus || 'PAID').toUpperCase()) + '\n';

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