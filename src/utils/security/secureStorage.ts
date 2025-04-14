
/**
 * Secure Storage Utilities
 * Provides secure methods for storing sensitive data
 */
import logger from '@/utils/logger';

// Storage keys with prefixes for better organization
const keyPrefix = 'app_secure_';

// List of sensitive keys that should never be stored in localStorage
const sensitiveKeys = [
  'token',
  'auth',
  'password',
  'secret',
  'api_key',
  'private_key',
  'supabase_key',
  'refresh_token'
];

// Check if a key is considered sensitive
function isSensitiveKey(key: string): boolean {
  return sensitiveKeys.some(sensitiveKey => 
    key.toLowerCase().includes(sensitiveKey.toLowerCase())
  );
}

/**
 * Initialize secure storage
 * Sets up storage protection and migrates any sensitive data
 */
export function initializeSecureStorage(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    
    // Scan localStorage for sensitive keys and migrate them to sessionStorage
    Object.keys(localStorage).forEach(key => {
      if (isSensitiveKey(key)) {
        const value = localStorage.getItem(key);
        
        if (value && typeof sessionStorage !== 'undefined') {
          // Migrate to sessionStorage
          sessionStorage.setItem(key, value);
          localStorage.removeItem(key);
          
          logger.info(`Migrated sensitive data from localStorage to sessionStorage: ${key}`);
        }
      }
    });
  } catch (error) {
    logger.error('Error initializing secure storage', { error });
  }
}

/**
 * Get a value from secure storage
 * @param key Storage key
 * @returns Stored value or null if not found
 */
export function getSecureItem(key: string): string | null {
  const prefixedKey = `${keyPrefix}${key}`;
  
  try {
    // For sensitive keys, try sessionStorage first
    if (isSensitiveKey(key) && typeof sessionStorage !== 'undefined') {
      const value = sessionStorage.getItem(prefixedKey);
      if (value) return value;
    }
    
    // Fall back to localStorage for non-sensitive or if not in sessionStorage
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(prefixedKey);
    }
    
    return null;
  } catch (error) {
    logger.error('Error retrieving from secure storage', { error, key });
    return null;
  }
}

/**
 * Store a value in secure storage
 * @param key Storage key
 * @param value Value to store
 * @param forcePersist Whether to force persistent storage even for sensitive data
 * @returns Whether the operation was successful
 */
export function setSecureItem(key: string, value: string, forcePersist = false): boolean {
  const prefixedKey = `${keyPrefix}${key}`;
  
  try {
    // For sensitive keys, use sessionStorage unless forced to persist
    if (isSensitiveKey(key) && !forcePersist) {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(prefixedKey, value);
        return true;
      }
    } else {
      // For non-sensitive keys or when forced, use localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(prefixedKey, value);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    logger.error('Error storing in secure storage', { error, key });
    return false;
  }
}

/**
 * Remove a value from secure storage
 * @param key Storage key
 * @returns Whether the operation was successful
 */
export function removeSecureItem(key: string): boolean {
  const prefixedKey = `${keyPrefix}${key}`;
  
  try {
    let removed = false;
    
    // Remove from sessionStorage if present
    if (typeof sessionStorage !== 'undefined') {
      if (sessionStorage.getItem(prefixedKey)) {
        sessionStorage.removeItem(prefixedKey);
        removed = true;
      }
    }
    
    // Also remove from localStorage if present
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem(prefixedKey)) {
        localStorage.removeItem(prefixedKey);
        removed = true;
      }
    }
    
    return removed;
  } catch (error) {
    logger.error('Error removing from secure storage', { error, key });
    return false;
  }
}

/**
 * Clear all secure storage items
 * @param clearNonSensitive Whether to also clear non-sensitive items
 * @returns Number of items cleared
 */
export function clearSecureStorage(clearNonSensitive = true): number {
  try {
    let count = 0;
    
    // Clear from sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      const sessionKeys = Object.keys(sessionStorage);
      sessionKeys.forEach(key => {
        if (key.startsWith(keyPrefix)) {
          if (clearNonSensitive || isSensitiveKey(key.substring(keyPrefix.length))) {
            sessionStorage.removeItem(key);
            count++;
          }
        }
      });
    }
    
    // Clear from localStorage
    if (typeof localStorage !== 'undefined') {
      const localKeys = Object.keys(localStorage);
      localKeys.forEach(key => {
        if (key.startsWith(keyPrefix)) {
          if (clearNonSensitive || isSensitiveKey(key.substring(keyPrefix.length))) {
            localStorage.removeItem(key);
            count++;
          }
        }
      });
    }
    
    return count;
  } catch (error) {
    logger.error('Error clearing secure storage', { error });
    return 0;
  }
}

/**
 * Store Supabase credentials securely
 * @param accessToken Access token
 * @param refreshToken Refresh token (optional)
 * @returns Whether the operation was successful
 */
export function storeSupabaseCredentials(
  accessToken: string,
  refreshToken?: string
): boolean {
  try {
    let success = true;
    
    // Always store access token in sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(`${keyPrefix}supabase_access_token`, accessToken);
    } else {
      success = false;
    }
    
    // Store refresh token if provided
    if (refreshToken && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(`${keyPrefix}supabase_refresh_token`, refreshToken);
    }
    
    return success;
  } catch (error) {
    logger.error('Error storing Supabase credentials', { error });
    return false;
  }
}

/**
 * Get stored Supabase credentials
 * @returns Object containing tokens or null if not found
 */
export function getSupabaseCredentials(): { 
  accessToken: string | null; 
  refreshToken: string | null;
} {
  try {
    let accessToken: string | null = null;
    let refreshToken: string | null = null;
    
    // Try to get tokens from sessionStorage first
    if (typeof sessionStorage !== 'undefined') {
      accessToken = sessionStorage.getItem(`${keyPrefix}supabase_access_token`);
      refreshToken = sessionStorage.getItem(`${keyPrefix}supabase_refresh_token`);
    }
    
    // Fallback to localStorage only if tokens weren't found in sessionStorage
    if (!accessToken && typeof localStorage !== 'undefined') {
      // This is just to handle legacy tokens - new ones should only be in sessionStorage
      accessToken = localStorage.getItem(`${keyPrefix}supabase_access_token`);
      
      // Migrate to sessionStorage if found
      if (accessToken && typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(`${keyPrefix}supabase_access_token`, accessToken);
        localStorage.removeItem(`${keyPrefix}supabase_access_token`);
      }
    }
    
    if (!refreshToken && typeof localStorage !== 'undefined') {
      // This is just to handle legacy tokens - new ones should only be in sessionStorage
      refreshToken = localStorage.getItem(`${keyPrefix}supabase_refresh_token`);
      
      // Migrate to sessionStorage if found
      if (refreshToken && typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(`${keyPrefix}supabase_refresh_token`, refreshToken);
        localStorage.removeItem(`${keyPrefix}supabase_refresh_token`);
      }
    }
    
    return { accessToken, refreshToken };
  } catch (error) {
    logger.error('Error retrieving Supabase credentials', { error });
    return { accessToken: null, refreshToken: null };
  }
}

/**
 * Clear Supabase credentials
 * @returns Whether the operation was successful
 */
export function clearSupabaseCredentials(): boolean {
  try {
    // Clear from sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(`${keyPrefix}supabase_access_token`);
      sessionStorage.removeItem(`${keyPrefix}supabase_refresh_token`);
    }
    
    // Also clear from localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`${keyPrefix}supabase_access_token`);
      localStorage.removeItem(`${keyPrefix}supabase_refresh_token`);
    }
    
    return true;
  } catch (error) {
    logger.error('Error clearing Supabase credentials', { error });
    return false;
  }
}
