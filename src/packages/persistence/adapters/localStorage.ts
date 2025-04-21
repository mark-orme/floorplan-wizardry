
/**
 * LocalStorage Adapter
 * Implementation of storage adapter using browser localStorage
 */

import { StorageAdapter } from '../interfaces/storageAdapter';
import { StorageResult } from '../interfaces/storageResult';

/**
 * LocalStorage adapter implementation
 */
export class LocalStorageAdapter implements StorageAdapter {
  /**
   * Get an item from localStorage
   */
  async getItem<T>(key: string): Promise<StorageResult<T>> {
    try {
      const data = localStorage.getItem(key);
      
      if (data === null) {
        return { success: true }; // Item not found but operation successful
      }
      
      return {
        success: true,
        data: JSON.parse(data) as T
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error getting item from localStorage'
      };
    }
  }
  
  /**
   * Set an item in localStorage
   */
  async setItem<T>(key: string, value: T): Promise<StorageResult<void>> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error setting item in localStorage'
      };
    }
  }
  
  /**
   * Remove an item from localStorage
   */
  async removeItem(key: string): Promise<StorageResult<void>> {
    try {
      localStorage.removeItem(key);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error removing item from localStorage'
      };
    }
  }
  
  /**
   * Clear all items from localStorage
   */
  async clear(): Promise<StorageResult<void>> {
    try {
      localStorage.clear();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error clearing localStorage'
      };
    }
  }
  
  /**
   * Get all keys in localStorage
   */
  async keys(): Promise<StorageResult<string[]>> {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== null) {
          keys.push(key);
        }
      }
      return { success: true, data: keys };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error getting keys from localStorage'
      };
    }
  }
}
