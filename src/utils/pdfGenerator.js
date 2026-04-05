// frontend/src/utils/pdfGenerator.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

const getUnitLabel = (unit, quantity = 1) => {
  const labels = {
    piece: quantity > 1 ? 'pcs' : 'pc',
    kg: 'kg',
    gram: 'g',
    dozen: 'dz',
    plate: 'plt',
    box: 'box',
    pack: 'pk',
    bottle: 'btl',
    litre: 'L',
    half: 'half',
    full: 'full',
    small: 'S',
    medium: 'M',
    large: 'L',
    regular: 'reg',
    family: 'fam',
    crate: 'crt',
    bundle: 'bdl'
  };
  return labels[unit] || unit || 'pc';
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

/**
 * Generate thermal receipt HTML for printing
 * Optimized for 80mm thermal printers (72mm printable)
 */
export const generateThermalHTML = (bill, restaurant = {}) => {
  if (!bill) return '';

  const discountAmount = bill.discountType === 'percentage'
    ? (bill.subtotal * bill.discount) / 100
    : bill.discountAmount || bill.discount || 0;

  const itemsHTML = bill.items?.map(item => `
    <div class="item">
      <div class="item-name">${item.name || 'Item'}${item.notes ? '*' : ''}</div>
      <div class="item-details">
        <span>${item.quantity} ${getUnitLabel(item.unit, item.quantity)} x ${item.price?.toFixed(0) || '0'}</span>
        <span class="item-total">${(item.subtotal || item.price * item.quantity)?.toFixed(0) || '0'}</span>
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
  <title>Receipt - ${bill.billNumber || 'Invoice'}</title>
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
    
    .customer-info div {
      margin-bottom: 0.5mm;
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
      word-wrap: break-word;
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
    
    .capitalize {
      text-transform: capitalize;
    }

    @media print {
      html, body {
        width: 72mm !important;
        max-width: 72mm !important;
        margin: 0 !important;
        padding: 2mm !important;
      }
      
      @page {
        size: 72mm auto;
        margin: 0;
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
    <div class="invoice-number">#${bill.billNumber || 'N/A'}</div>
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
  ` : `
    <div class="customer-info">
      <div>Type: ${(bill.billType || 'counter').toUpperCase()}</div>
    </div>
  `}
  
  <!-- Items Header -->
  <div class="items-header">
    <span>Item</span>
    <span>Amt</span>
  </div>
  
  <!-- Items -->
  <div class="items-list">
    ${itemsHTML}
  </div>
  
  <div class="divider"></div>
  
  <!-- Totals -->
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
      }, 300);
    };
  </script>
</body>
</html>
  `;
};

/**
 * Open thermal print window - optimized for 80mm thermal printer
 */
export const openPrintWindow = (bill, restaurant) => {
  try {
    const html = generateThermalHTML(bill, restaurant);
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    
    if (!printWindow) {
      console.error('Popup blocked - please allow popups');
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
 * Generate PDF for downloads (keeping jsPDF for PDF exports)
 */
export const generateInvoicePDF = (bill, restaurant = {}) => {
  // Calculate dynamic height based on items
  const baseHeight = 150;
  const itemHeight = bill.items?.length * 8 || 0;
  const notesHeight = bill.items?.filter(i => i.notes).length * 4 || 0;
  const totalHeight = Math.min(300, baseHeight + itemHeight + notesHeight);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, totalHeight]
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 10;

  // Helper function for centered text
  const centerText = (text, yPos, fontSize = 10) => {
    doc.setFontSize(fontSize);
    const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, Math.max(5, x), yPos);
  };

  // Helper for line
  const drawLine = (yPos) => {
    doc.setLineWidth(0.1);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(5, yPos, pageWidth - 5, yPos);
  };

  // Restaurant Name
  doc.setFont('helvetica', 'bold');
  centerText(restaurant.name || 'Shan Biryani', y, 14);
  y += 6;

  // Restaurant Address
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  if (restaurant.address) {
    centerText(restaurant.address, y, 8);
    y += 4;
  }
  if (restaurant.phone) {
    centerText(`Tel: ${restaurant.phone}`, y, 8);
    y += 6;
  }

  // Divider
  drawLine(y);
  y += 4;

  // Invoice Title
  doc.setFont('helvetica', 'bold');
  centerText('INVOICE', y, 12);
  y += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  centerText(`#${bill.billNumber || 'N/A'}`, y);
  y += 4;
  centerText(new Date(bill.createdAt || new Date()).toLocaleString(), y);
  y += 6;

  // Divider
  drawLine(y);
  y += 4;

  // Customer Info
  if (bill.customerName || bill.tableNumber || bill.customerPhone) {
    doc.setFontSize(8);
    if (bill.customerName) {
      doc.text(`Customer: ${bill.customerName}`, 5, y);
      y += 4;
    }
    if (bill.customerPhone) {
      doc.text(`Phone: ${bill.customerPhone}`, 5, y);
      y += 4;
    }
    if (bill.tableNumber) {
      doc.text(`Table: ${bill.tableNumber}`, 5, y);
      y += 4;
    }
    y += 2;
  }

  // Items Table with Unit support
  const tableData = (bill.items || []).map(item => {
    const unit = getUnitLabel(item.unit, item.quantity);
    const qtyText = `${item.quantity} ${unit}`;
    const subtotal = item.subtotal || (item.price * item.quantity);
    return [
      (item.name || 'Item').substring(0, 18) + (item.notes ? '*' : ''),
      qtyText,
      item.price?.toFixed(0) || '0',
      subtotal?.toFixed(0) || '0'
    ];
  });

  // Use autoTable as imported function
  autoTable(doc, {
    startY: y,
    head: [['Item', 'Qty', 'Rate', 'Amt']],
    body: tableData,
    theme: 'plain',
    styles: {
      fontSize: 7,
      cellPadding: 1,
    },
    headStyles: {
      fontStyle: 'bold',
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 14, halign: 'center' },
      2: { cellWidth: 12, halign: 'right' },
      3: { cellWidth: 16, halign: 'right' },
    },
    margin: { left: 5, right: 5 },
  });

  y = doc.lastAutoTable.finalY + 2;

  // Item notes if any
  const itemsWithNotes = (bill.items || []).filter(i => i.notes);
  if (itemsWithNotes.length > 0) {
    doc.setFontSize(6);
    itemsWithNotes.forEach(item => {
      doc.text(`* ${item.name}: ${item.notes}`, 5, y);
      y += 3;
    });
    y += 2;
  }

  // Divider
  drawLine(y);
  y += 4;

  // Totals
  doc.setFontSize(8);
  const rightX = pageWidth - 5;
  
  doc.text('Subtotal:', 5, y);
  doc.text(`Rs.${bill.subtotal?.toFixed(0) || '0'}`, rightX, y, { align: 'right' });
  y += 4;

  if (bill.discountAmount > 0) {
    const discountLabel = bill.discountType === 'percentage' 
      ? `Discount (${bill.discount}%):` 
      : 'Discount:';
    doc.text(discountLabel, 5, y);
    doc.text(`-Rs.${bill.discountAmount?.toFixed(0)}`, rightX, y, { align: 'right' });
    y += 4;
  }

  if (bill.taxAmount > 0) {
    doc.text(`Tax (${bill.taxRate}%):`, 5, y);
    doc.text(`Rs.${bill.taxAmount?.toFixed(0)}`, rightX, y, { align: 'right' });
    y += 4;
  }

  // Grand Total
  drawLine(y);
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL:', 5, y);
  doc.text(`Rs.${bill.grandTotal?.toFixed(0) || '0'}`, rightX, y, { align: 'right' });
  y += 6;

  // Payment Info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  drawLine(y);
  y += 4;
  
  doc.text(`Payment: ${(bill.paymentMethod || 'cash').toUpperCase()}`, 5, y);
  doc.text(`Status: ${(bill.paymentStatus || 'paid').toUpperCase()}`, rightX, y, { align: 'right' });
  y += 4;
  
  if (bill.amountPaid > 0) {
    doc.text(`Received: Rs.${bill.amountPaid?.toFixed(0)}`, 5, y);
    y += 4;
    if (bill.changeAmount > 0) {
      doc.text(`Change: Rs.${bill.changeAmount?.toFixed(0)}`, 5, y);
      y += 4;
    }
  }

  // Footer
  y += 4;
  drawLine(y);
  y += 4;
  doc.setFont('helvetica', 'bold');
  centerText(restaurant.footerText || 'Thank you for your visit!', y, 8);
  y += 4;
  doc.setFont('helvetica', 'normal');
  centerText('Please come again', y, 8);

  return doc;
};

/**
 * Download invoice as PDF
 */
export const downloadInvoicePDF = (bill, restaurant) => {
  try {
    const doc = generateInvoicePDF(bill, restaurant);
    doc.save(`Invoice-${bill.billNumber || 'bill'}.pdf`);
    return true;
  } catch (error) {
    console.error('PDF download error:', error);
    return false;
  }
};

/**
 * Share invoice via Web Share API or fallback to download
 */
export const shareInvoicePDF = async (bill, restaurant) => {
  try {
    const doc = generateInvoicePDF(bill, restaurant);
    const pdfBlob = doc.output('blob');
    
    if (navigator.share && navigator.canShare) {
      const file = new File([pdfBlob], `Invoice-${bill.billNumber || 'bill'}.pdf`, { 
        type: 'application/pdf' 
      });
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Invoice ${bill.billNumber}`,
          text: `Invoice from ${restaurant?.name || 'Shan Biryani'} - Total: Rs.${bill.grandTotal}`
        });
        return true;
      }
    }
    
    // Fallback: Download if share not supported
    downloadInvoicePDF(bill, restaurant);
    return false;
  } catch (error) {
    console.error('Share error:', error);
    downloadInvoicePDF(bill, restaurant);
    return false;
  }
};

/**
 * Direct print to thermal printer (no preview)
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
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
    
    // Cleanup after print
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      resolve(true);
    }, 5000);
  });
};

export default {
  generateThermalHTML,
  generateInvoicePDF,
  openPrintWindow,
  downloadInvoicePDF,
  shareInvoicePDF,
  printThermalDirect
};