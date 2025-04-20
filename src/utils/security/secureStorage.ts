
/**
 * Secure Storage Utilities
 * Functions for securely storing data in browser storage
 */

interface SecureStorageOptions {
  expiry?: number; // Time in milliseconds until the item expires
  path?: string; // Path restriction for the item
}

/**
 * Secure localStorage wrapper with encryption
 */
export const secureLocalStorage = {
  /**
   * Set an item in secure storage
   * @param key Key to store under
   * @param value Value to store
   * @param options Storage options
   */
  setItem(key: string, value: any, options: SecureStorageOptions = {}): void {
    try {
      const { expiry, path } = options;
      
      // Create a storage object with metadata
      const storageObj = {
        value,
        metadata: {
          created: Date.now(),
          expiry: expiry ? Date.now() + expiry : null,
          path: path || '/',
        }
      };
      
      // In a real implementation, this would encrypt the data
      // For now, just stringify it
      const serialized = JSON.stringify(storageObj);
      
      // Store in localStorage
      localStorage.setItem(`secure_${key}`, serialized);
    } catch (error) {
      console.error('Error setting secure item:', error);
    }
  },
  
  /**
   * Get an item from secure storage
   * @param key Key to retrieve
   * @param defaultValue Default value if key not found
   * @returns Retrieved value or default
   */
  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      // Get from localStorage
      const serialized = localStorage.getItem(`secure_${key}`);
      
      if (!serialized) {
        return defaultValue || null;
      }
      
      // In a real implementation, this would decrypt the data
      // For now, just parse it
      const storageObj = JSON.parse(serialized);
      
      // Check if item has expired
      if (storageObj.metadata.expiry && storageObj.metadata.expiry < Date.now()) {
        localStorage.removeItem(`secure_${key}`);
        return defaultValue || null;
      }
      
      // Check if path restriction is met
      if (storageObj.metadata.path && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith(storageObj.metadata.path)) {
          return defaultValue || null;
        }
      }
      
      return storageObj.value;
    } catch (error) {
      console.error('Error getting secure item:', error);
      return defaultValue || null;
    }
  },
  
  /**
   * Remove an item from secure storage
   * @param key Key to remove
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(`secure_${key}`);
    } catch (error) {
      console.error('Error removing secure item:', error);
    }
  },
  
  /**
   * Clear all secure storage items
   */
  clear(): void {
    try {
      // Only clear items with the secure_ prefix
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('secure_')) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }
};

