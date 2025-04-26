
/**
 * Toast Utilities
 * Provides standardized toast notifications
 * @module utils/toastUtils
 */

// Re-export toast from sonner
import { toast as sonnerToast } from 'sonner';

// Create enhanced toast API with consistent styling
export const toast = {
  success: (message: string, options = {}) => {
    return sonnerToast.success(message, {
      duration: 3000,
      ...options,
    });
  },
  
  error: (message: string, options = {}) => {
    return sonnerToast.error(message, {
      duration: 5000,
      ...options,
    });
  },
  
  warning: (message: string, options = {}) => {
    return sonnerToast.warning(message, {
      duration: 4000,
      ...options,
    });
  },
  
  info: (message: string, options = {}) => {
    return sonnerToast.info(message, {
      duration: 3000,
      ...options,
    });
  },
  
  // Original toast function
  ...sonnerToast
};

export default toast;
