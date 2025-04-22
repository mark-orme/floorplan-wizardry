
import { z } from "zod";
import { sanitizeHtml, sanitizeObject } from '../utils/security/inputSanitization';

export const validateEmail = (email: string): boolean => {
  const emailSchema = z.string().email();
  const result = emailSchema.safeParse(email);
  return result.success;
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
  const result = urlSchema.safeParse(url);
  return result.success;
};

// Phone number validation (simple version)
export const validatePhoneNumber = (phone: string): boolean => {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

// Credit card validation
export const validateCreditCard = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/[\s-]/g, '');
  if (!/^\d+$/.test(digits) || digits.length < 13 || digits.length > 19) {
    return false;
  }
  let sum = 0;
  let double = false;
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
  try {
    return !isNaN(Date.parse(dateStr));
  } catch (error) {
    return false;
  }
};

export const validateAlphaNumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value);
};

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

export const validateIPAddress = (ip: string): boolean => {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
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
