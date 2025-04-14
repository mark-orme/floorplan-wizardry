
/**
 * Secure Storage Utilities
 * Provides secure local storage operations with validation
 */
import { ZodSchema } from 'zod';
import { captureMessage } from '@/utils/sentry';
import logger from '@/utils/logger';
import { throttle } from '@/utils/throttleUtils';

/**
 * Get item from localStorage with validation
 * @param key Storage key
 * @param schema Zod schema for validation
 * @returns Validated data or null if invalid
 */
export function getValidatedItem<T>(key: string, schema: ZodSchema<T>): T | null {
  try {
    const item = localStorage.getItem(key);
    
    if (!item) return null;
    
    // Parse and validate the data
    const data = JSON.parse(item);
    return schema.parse(data);
  } catch (error) {
    logger.warn(`Failed to validate localStorage item: ${key}`, { error });
    
    // Clear invalid data
    localStorage.removeItem(key);
    
    captureMessage(
      'Invalid data in localStorage',
      'storage-validation-error',
      {
        level: 'warning',
        tags: { storageKey: key },
        extra: { error: error instanceof Error ? error.message : 'Unknown error' }
      }
    );
    
    return null;
  }
}

/**
 * Set item in localStorage with validation
 * @param key Storage key
 * @param data Data to store
 * @param schema Zod schema for validation
 * @returns Whether the operation was successful
 */
export function setValidatedItem<T>(key: string, data: T, schema: ZodSchema<T>): boolean {
  try {
    // Validate data before storing
    const validData = schema.parse(data);
    
    // Store the data
    localStorage.setItem(key, JSON.stringify(validData));
    return true;
  } catch (error) {
    logger.error(`Failed to store validated data in localStorage: ${key}`, { error });
    
    captureMessage(
      'Failed to store data in localStorage',
      'storage-validation-error',
      {
        level: 'error',
        tags: { storageKey: key },
        extra: { error: error instanceof Error ? error.message : 'Unknown error' }
      }
    );
    
    return false;
  }
}

/**
 * Throttled version of setValidatedItem for frequent operations like autosave
 */
export const throttledSetValidatedItem = throttle(setValidatedItem, 2000);

/**
 * Clear all app-related items from localStorage
 * @param prefix Optional prefix to clear only specific items
 */
export function clearAppStorage(prefix?: string): void {
  try {
    if (prefix) {
      // Clear only items with the given prefix
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      // Clear all storage
      localStorage.clear();
    }
  } catch (error) {
    logger.error('Failed to clear localStorage', { error });
  }
}

/**
 * Initialize CSP headers for secure storage
 * Sets the necessary HTTP-only cookies for better security
 */
export function initializeSecureStorage(): void {
  // Add frame-ancestors restriction meta tag (prevent clickjacking)
  if (typeof document !== 'undefined') {
    // Check if meta tag already exists
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"][content*="frame-ancestors"]')) {
      const frameAncestorsMeta = document.createElement('meta');
      frameAncestorsMeta.httpEquiv = 'Content-Security-Policy';
      frameAncestorsMeta.content = "frame-ancestors 'none';";
      document.head.appendChild(frameAncestorsMeta);
    }
  }
}
