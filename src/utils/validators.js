export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^(\+92|0)?[0-9]{10}$/;
  return re.test(phone.replace(/[\s-]/g, ''));
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

export const validateNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) >= 0;
};

export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const value = data[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = fieldRules.requiredMessage || `${field} is required`;
      return;
    }
    
    if (value) {
      if (fieldRules.email && !validateEmail(value)) {
        errors[field] = 'Please enter a valid email';
      }
      
      if (fieldRules.phone && !validatePhone(value)) {
        errors[field] = 'Please enter a valid phone number';
      }
      
      if (fieldRules.minLength && !validateMinLength(value, fieldRules.minLength)) {
        errors[field] = `Must be at least ${fieldRules.minLength} characters`;
      }
      
      if (fieldRules.maxLength && !validateMaxLength(value, fieldRules.maxLength)) {
        errors[field] = `Must be less than ${fieldRules.maxLength} characters`;
      }
      
      if (fieldRules.number && !validateNumber(value)) {
        errors[field] = 'Must be a valid number';
      }
      
      if (fieldRules.positive && !validatePositiveNumber(value)) {
        errors[field] = 'Must be a positive number';
      }
      
      if (fieldRules.match && value !== data[fieldRules.match]) {
        errors[field] = fieldRules.matchMessage || 'Values do not match';
      }
    }
  });
  
  return errors;
};

export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};