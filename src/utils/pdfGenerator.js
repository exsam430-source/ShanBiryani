// frontend/src/utils/pdfGenerator.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const getUnitLabel = (unit) => {
  const labels = {
    piece: 'Pc',
    kg: 'Kg',
    gram: 'g',
    dozen: 'Dz',
    plate: 'Plate',
    box: 'Box',
    pack: 'Pack',
    bottle: 'Bottle',
    litre: 'L',
    half: 'Half',
    full: 'Full',
    small: 'S',
    medium: 'M',
    large: 'L',
    regular: 'Reg',
    family: 'Family',
    crate: 'Crate',
    bundle: 'Bundle'
  };
  return labels[unit] || unit || 'Pc';
};

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
    const unit = getUnitLabel(item.unit);
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

export const openPrintWindow = (bill, restaurant) => {
  try {
    const doc = generateInvoicePDF(bill, restaurant);
    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl, '_blank');
    return true;
  } catch (error) {
    console.error('Print error:', error);
    return false;
  }
};