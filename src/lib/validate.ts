
import * as z from 'zod';

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailSchema = z.string().email();
  try {
    emailSchema.parse(email);
    return true;
  } catch (error) {
    return false;
  }
};

// Password strength validation
export const validatePasswordStrength = (password: string): { 
  isValid: boolean; 
  errors: string[]; 
  strength: 'weak' | 'medium' | 'strong' 
} => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  if (errors.length <= 2) {
    strength = 'medium';
  }
  
  if (errors.length === 0) {
    strength = 'strong';
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};

// URL validation
export const validateURL = (url: string): boolean => {
  const urlSchema = z.string().url();
  try {
    urlSchema.parse(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Phone number validation (simple version)
export const validatePhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters for comparison
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

// Credit card validation
export const validateCreditCard = (cardNumber: string): boolean => {
  // Remove spaces and hyphens
  const digits = cardNumber.replace(/[\s-]/g, '');
  
  // Check if contains only digits and has a valid length
  if (!/^\d+$/.test(digits) || digits.length < 13 || digits.length > 19) {
    return false;
  }
  
  // Luhn algorithm (checksum)
  let sum = 0;
  let double = false;
  
  // Start from the rightmost digit and process each digit
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));
    
    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    double = !double;
  }
  
  return sum % 10 === 0;
};

// Date validation with format checking
export const validateDate = (dateStr: string, format: string = 'YYYY-MM-DD'): boolean => {
  // For simplicity, we'll just validate ISO format dates with Zod
  const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  });
  
  try {
    dateSchema.parse(dateStr);
    return true;
  } catch (error) {
    return false;
  }
};

// Alpha-numeric validation
export const validateAlphaNumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value);
};

// Username validation
export const validateUsername = (username: string): { isValid: boolean; message?: string } => {
  if (username.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 30) {
    return { isValid: false, message: 'Username must be less than 30 characters' };
  }
  
  if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, underscores, dots, and hyphens' };
  }
  
  return { isValid: true };
};

// IP address validation
export const validateIPAddress = (ip: string): boolean => {
  const ipSchema = z.string().ip();
  try {
    ipSchema.parse(ip);
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  validateEmail,
  validatePasswordStrength,
  validateURL,
  validatePhoneNumber,
  validateCreditCard,
  validateDate,
  validateAlphaNumeric,
  validateUsername,
  validateIPAddress
};
