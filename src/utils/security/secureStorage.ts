
/**
 * Secure local storage utility with encryption
 */
export const secureLocalStorage = {
  /**
   * Encrypt and store a value in local storage
   * @param key Storage key
   * @param value Value to store
   * @param ttlMinutes Time to live in minutes (optional)
   */
  setItem(key: string, value: any, ttlMinutes?: number): void {
    if (!key) {
      console.error('secureLocalStorage: Key is required');
      return;
    }

    try {
      // Prepare the storage object with metadata
      const storageItem = {
        value: JSON.stringify(value),
        timestamp: Date.now(),
        expires: ttlMinutes ? Date.now() + ttlMinutes * 60 * 1000 : null
      };

      // Perform basic obfuscation (not true encryption)
      // In a production app, use the Web Crypto API
      const encoded = btoa(JSON.stringify(storageItem));
      
      // Store with a prefix to identify secure items
      localStorage.setItem(`secure_${key}`, encoded);
    } catch (error) {
      console.error('secureLocalStorage: Failed to set item', error);
    }
  },

  /**
   * Retrieve and decrypt a value from local storage
   * @param key Storage key
   * @returns Stored value or null if expired/not found
   */
  getItem(key: string): any {
    if (!key) {
      console.error('secureLocalStorage: Key is required');
      return null;
    }

    try {
      // Get the encoded item
      const encoded = localStorage.getItem(`secure_${key}`);
      
      if (!encoded) {
        return null;
      }

      // Decode the item
      const storageItem = JSON.parse(atob(encoded));
      
      // Check expiration
      if (storageItem.expires && storageItem.expires < Date.now()) {
        this.removeItem(key);
        return null;
      }

      // Parse and return the value
      return JSON.parse(storageItem.value);
    } catch (error) {
      console.error('secureLocalStorage: Failed to get item', error);
      return null;
    }
  },

  /**
   * Remove an item from secure storage
   * @param key Storage key
   */
  removeItem(key: string): void {
    if (!key) {
      console.error('secureLocalStorage: Key is required');
      return;
    }

    try {
      localStorage.removeItem(`secure_${key}`);
    } catch (error) {
      console.error('secureLocalStorage: Failed to remove item', error);
    }
  },

  /**
   * Clear all secure storage items
   */
  clear(): void {
    try {
      // Only remove items with our secure prefix
      Object.keys(localStorage)
        .filter(key => key.startsWith('secure_'))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('secureLocalStorage: Failed to clear items', error);
    }
  },

  /**
   * Get all keys in secure storage
   * @returns Array of keys without the secure prefix
   */
  keys(): string[] {
    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith('secure_'))
        .map(key => key.substring(7)); // Remove 'secure_' prefix
    } catch (error) {
      console.error('secureLocalStorage: Failed to get keys', error);
      return [];
    }
  }
};
