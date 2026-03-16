export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Shan Biryani';

export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'yellow' },
  confirmed: { label: 'Confirmed', color: 'blue' },
  preparing: { label: 'Preparing', color: 'orange' },
  ready: { label: 'Ready', color: 'purple' },
  'out-for-delivery': { label: 'Out for Delivery', color: 'indigo' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' }
};

export const PAYMENT_METHODS = {
  cash: { label: 'Cash', icon: 'Banknote' },
  card: { label: 'Card', icon: 'CreditCard' },
  online: { label: 'Online', icon: 'Smartphone' }
};

export const PAYMENT_STATUSES = {
  pending: { label: 'Pending', color: 'yellow' },
  paid: { label: 'Paid', color: 'green' },
  refunded: { label: 'Refunded', color: 'red' }
};

export const USER_ROLES = {
  admin: { label: 'Admin', color: 'red' },
  staff: { label: 'Staff', color: 'blue' },
  customer: { label: 'Customer', color: 'green' }
};

export const BILL_TYPES = {
  'dine-in': { label: 'Dine In', icon: 'UtensilsCrossed' },
  takeaway: { label: 'Takeaway', icon: 'ShoppingBag' },
  delivery: { label: 'Delivery', icon: 'Truck' },
  counter: { label: 'Counter', icon: 'Store' }
};

export const SPICY_LEVELS = [
  { value: 0, label: 'Not Spicy', emoji: '🌱' },
  { value: 1, label: 'Mild', emoji: '🌶️' },
  { value: 2, label: 'Medium', emoji: '🌶️🌶️' },
  { value: 3, label: 'Hot', emoji: '🌶️🌶️🌶️' },
  { value: 4, label: 'Very Hot', emoji: '🌶️🌶️🌶️🌶️' },
  { value: 5, label: 'Extreme', emoji: '🔥' }
];

export const CURRENCY = {
  symbol: 'Rs.',
  code: 'PKR'
};

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];