import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { CURRENCY } from './constants.js';

export const formatPrice = (price, showCurrency = true) => {
  if (price === undefined || price === null) return '';
  const formattedPrice = Number(price).toLocaleString('en-PK');
  return showCurrency ? `${CURRENCY.symbol} ${formattedPrice}` : formattedPrice;
};

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  return format(new Date(date), formatStr);
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy hh:mm a');
};

export const formatTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'hh:mm a');
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatSmartDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  
  if (isToday(d)) {
    return `Today at ${formatTime(d)}`;
  }
  
  if (isYesterday(d)) {
    return `Yesterday at ${formatTime(d)}`;
  }
  
  return formatDateTime(d);
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  // Format as Pakistani phone number
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('92')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)}-${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  }
  return phone;
};

export const formatOrderNumber = (orderNumber) => {
  if (!orderNumber) return '';
  return orderNumber.toUpperCase();
};

export const formatPercentage = (value, decimals = 0) => {
  if (value === undefined || value === null) return '';
  return `${Number(value).toFixed(decimals)}%`;
};

export const formatNumber = (number, decimals = 0) => {
  if (number === undefined || number === null) return '';
  return Number(number).toLocaleString('en-PK', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

export const formatCompactNumber = (number) => {
  if (number === undefined || number === null) return '';
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number.toString();
};

export const formatDuration = (minutes) => {
  if (!minutes) return '';
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};