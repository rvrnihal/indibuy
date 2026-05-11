// Format Price
export const formatPrice = (price) => {
  if (!price) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

// Format Date
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format DateTime
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format Relative Time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  return `${months}mo ago`;
};

// Validate Email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate Phone
export const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone.replace(/[^\d]/g, ''));
};

// Validate Password
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Validate Zip Code
export const validateZipCode = (zipCode) => {
  const regex = /^[0-9]{6}$/;
  return regex.test(zipCode);
};

// Truncate Text
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Capitalize First Letter
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Format Order Status
export const getOrderStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-cyan-100 text-cyan-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Format Payment Status
export const getPaymentStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Calculate Discount Percentage
export const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
  if (!originalPrice || originalPrice === 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

// Format Rating
export const formatRating = (rating) => {
  if (!rating) return '0.0';
  return rating.toFixed(1);
};

// Generate Query String
export const generateQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, value);
    }
  });
  return query.toString();
};

// Parse Query String
export const parseQueryString = (queryString) => {
  const params = {};
  const searchParams = new URLSearchParams(queryString);
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
};

// Get Initials from Name
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

// Generate Random Color
export const generateRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#6C5CE7', '#A29BFE', '#00B894', '#FDCB6E', '#E17055'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Calculate Cart Total
export const calculateCartTotal = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 500 ? 0 : 100;
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
  };
};

// Check if Item is Discounted
export const isDiscounted = (originalPrice, discountedPrice) => {
  return originalPrice && discountedPrice && originalPrice > discountedPrice;
};

// Limit String Length with Ellipsis
export const limitString = (str, length) => {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + '...';
};

// Convert Array to Object by Key
export const arrayToObject = (arr, key) => {
  return arr.reduce((obj, item) => {
    obj[item[key]] = item;
    return obj;
  }, {});
};

// Group Array by Key
export const groupBy = (arr, key) => {
  return arr.reduce((grouped, item) => {
    const groupKey = item[key];
    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push(item);
    return grouped;
  }, {});
};

// Debounce Function
export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Throttle Function
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
