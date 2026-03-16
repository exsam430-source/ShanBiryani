export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const getImageUrl = (path) => {
  if (!path) return '/images/placeholder-food.jpg';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL?.replace('/api', '')}${path}`;
};

export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    confirmed: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    preparing: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    ready: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
    'out-for-delivery': 'bg-indigo-500/20 text-indigo-500 border-indigo-500/30',
    delivered: 'bg-green-500/20 text-green-500 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-500 border-red-500/30',
    paid: 'bg-green-500/20 text-green-500 border-green-500/30',
    refunded: 'bg-red-500/20 text-red-500 border-red-500/30'
  };
  return colors[status] || 'bg-gray-500/20 text-gray-500 border-gray-500/30';
};

export const getRoleColor = (role) => {
  const colors = {
    admin: 'bg-red-500/20 text-red-500',
    staff: 'bg-blue-500/20 text-blue-500',
    customer: 'bg-green-500/20 text-green-500'
  };
  return colors[role] || 'bg-gray-500/20 text-gray-500';
};