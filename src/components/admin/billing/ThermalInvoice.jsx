// frontend/src/components/admin/billing/ThermalInvoice.jsx
import { forwardRef } from 'react';

const formatPrice = (price) => {
  return `Rs.${(price || 0).toFixed(0)}`;
};

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

const getUnitLabel = (unit, quantity) => {
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

const ThermalInvoice = forwardRef(({ bill, restaurant }, ref) => {
  if (!bill) return null;

  const discountAmount = bill.discountType === 'percentage'
    ? (bill.subtotal * bill.discount) / 100
    : bill.discountAmount || bill.discount || 0;

  // Styles optimized for 80mm thermal printer (72mm printable = 576px at 203 DPI)
  const styles = {
    container: {
      width: '72mm',
      maxWidth: '72mm',
      padding: '2mm',
      fontFamily: 'monospace, "Courier New", Courier',
      fontSize: '11px',
      lineHeight: '1.3',
      color: '#000',
      backgroundColor: '#fff',
      margin: '0 auto'
    },
    center: {
      textAlign: 'center'
    },
    bold: {
      fontWeight: 'bold'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3mm',
      borderBottom: '1px dashed #000',
      paddingBottom: '2mm'
    },
    title: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '1mm'
    },
    subtitle: {
      fontSize: '9px',
      marginBottom: '0.5mm'
    },
    invoiceInfo: {
      textAlign: 'center',
      padding: '2mm 0',
      borderBottom: '1px dashed #000',
      marginBottom: '2mm'
    },
    invoiceTitle: {
      fontSize: '12px',
      fontWeight: 'bold'
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '1mm'
    },
    customerInfo: {
      fontSize: '10px',
      marginBottom: '2mm',
      paddingBottom: '2mm',
      borderBottom: '1px dashed #000'
    },
    itemsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid #000',
      paddingBottom: '1mm',
      marginBottom: '1mm',
      fontSize: '10px',
      fontWeight: 'bold'
    },
    itemRow: {
      marginBottom: '1.5mm',
      fontSize: '10px'
    },
    itemName: {
      display: 'block',
      marginBottom: '0.5mm'
    },
    itemDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: '2mm',
      fontSize: '9px',
      color: '#333'
    },
    itemNote: {
      fontSize: '8px',
      color: '#666',
      paddingLeft: '2mm',
      fontStyle: 'italic'
    },
    divider: {
      borderTop: '1px dashed #000',
      margin: '2mm 0'
    },
    totalsSection: {
      marginTop: '2mm'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '1mm',
      fontSize: '10px'
    },
    grandTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '13px',
      fontWeight: 'bold',
      borderTop: '1px solid #000',
      borderBottom: '1px solid #000',
      padding: '2mm 0',
      margin: '2mm 0'
    },
    paymentInfo: {
      fontSize: '10px',
      marginTop: '2mm',
      paddingTop: '2mm',
      borderTop: '1px dashed #000'
    },
    footer: {
      textAlign: 'center',
      marginTop: '3mm',
      paddingTop: '2mm',
      borderTop: '1px dashed #000',
      fontSize: '10px'
    },
    footerText: {
      fontWeight: 'bold',
      marginBottom: '1mm'
    },
    smallText: {
      fontSize: '8px',
      color: '#666'
    }
  };

  return (
    <div ref={ref} style={styles.container} className="thermal-invoice">
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>{restaurant?.name || 'Shan Biryani'}</div>
        {restaurant?.address && (
          <div style={styles.subtitle}>{restaurant.address}</div>
        )}
        {restaurant?.phone && (
          <div style={styles.subtitle}>Tel: {restaurant.phone}</div>
        )}
      </div>

      {/* Invoice Info */}
      <div style={styles.invoiceInfo}>
        <div style={styles.invoiceTitle}>INVOICE</div>
        <div style={{ fontSize: '10px' }}>#{bill.billNumber}</div>
        <div style={{ fontSize: '9px' }}>{formatDate(bill.createdAt)}</div>
      </div>

      {/* Customer Info */}
      {(bill.customerName || bill.tableNumber || bill.customerPhone) && (
        <div style={styles.customerInfo}>
          {bill.customerName && (
            <div>Customer: {bill.customerName}</div>
          )}
          {bill.customerPhone && (
            <div>Phone: {bill.customerPhone}</div>
          )}
          {bill.tableNumber && (
            <div>Table: {bill.tableNumber}</div>
          )}
          <div>Type: {bill.billType?.toUpperCase() || 'COUNTER'}</div>
        </div>
      )}

      {/* Items Header */}
      <div style={styles.itemsHeader}>
        <span style={{ flex: 1 }}>Item</span>
        <span style={{ width: '50px', textAlign: 'right' }}>Amt</span>
      </div>

      {/* Items */}
      <div style={{ marginBottom: '2mm' }}>
        {bill.items?.map((item, index) => (
          <div key={index} style={styles.itemRow}>
            <span style={styles.itemName}>
              {item.name}
              {item.notes && '*'}
            </span>
            <div style={styles.itemDetails}>
              <span>
                {item.quantity} {getUnitLabel(item.unit, item.quantity)} x {item.price?.toFixed(0)}
              </span>
              <span style={{ fontWeight: 'bold' }}>
                {(item.subtotal || item.price * item.quantity)?.toFixed(0)}
              </span>
            </div>
            {item.notes && (
              <div style={styles.itemNote}>• {item.notes}</div>
            )}
          </div>
        ))}
      </div>

      <div style={styles.divider} />

      {/* Totals */}
      <div style={styles.totalsSection}>
        <div style={styles.totalRow}>
          <span>Subtotal:</span>
          <span>{formatPrice(bill.subtotal)}</span>
        </div>
        
        {discountAmount > 0 && (
          <div style={{ ...styles.totalRow }}>
            <span>
              Discount{bill.discountType === 'percentage' ? ` (${bill.discount}%)` : ''}:
            </span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}
        
        {bill.taxAmount > 0 && (
          <div style={styles.totalRow}>
            <span>Tax ({bill.taxRate}%):</span>
            <span>{formatPrice(bill.taxAmount)}</span>
          </div>
        )}
      </div>

      {/* Grand Total */}
      <div style={styles.grandTotal}>
        <span>TOTAL:</span>
        <span>{formatPrice(bill.grandTotal)}</span>
      </div>

      {/* Payment Info */}
      <div style={styles.paymentInfo}>
        <div style={styles.row}>
          <span>Payment:</span>
          <span style={{ textTransform: 'capitalize' }}>{bill.paymentMethod || 'Cash'}</span>
        </div>
        <div style={styles.row}>
          <span>Status:</span>
          <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
            {bill.paymentStatus || 'Paid'}
          </span>
        </div>
        {bill.amountPaid > 0 && (
          <>
            <div style={styles.row}>
              <span>Received:</span>
              <span>{formatPrice(bill.amountPaid)}</span>
            </div>
            {bill.changeAmount > 0 && (
              <div style={styles.row}>
                <span>Change:</span>
                <span>{formatPrice(bill.changeAmount)}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerText}>
          {restaurant?.footerText || 'Thank you!'}
        </div>
        <div style={styles.smallText}>Please Come Again</div>
        <div style={{ ...styles.smallText, marginTop: '1mm' }}>
          {bill.createdBy?.name && `Served by: ${bill.createdBy.name}`}
        </div>
      </div>
    </div>
  );
});

ThermalInvoice.displayName = 'ThermalInvoice';

export default ThermalInvoice;