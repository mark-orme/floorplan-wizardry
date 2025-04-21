
/**
 * Local Storage Adapter
 * Adapter for browser localStorage
 * @module packages/persistence/adapters/localStorage
 */

import { StorageAdapter, StorageResult } from '../interfaces';
import logger from '@/utils/logger';

/**
 * Local storage adapter implementation
 */
export class LocalStorageAdapter<T> implements StorageAdapter<T> {
  /**
   * Namespace for storage keys
   */
  private namespace: string;
  
  /**
   * Constructor
   * @param namespace Namespace for storage keys
   */
  constructor(namespace: string = 'app') {
    this.namespace = namespace;
  }
  
  /**
   * Get namespaced key
   * @param key Base key
   * @returns Namespaced key
   */
  private getNamespacedKey(key: string): string {
    return `${this.namespace}:${key}`;
  }
  
  /**
   * Save data to localStorage
   * @param key Storage key
   * @param data Data to save
   */
  async save(key: string, data: T): Promise<StorageResult<void>> {
    try {
      const namespacedKey = this.getNamespacedKey(key);
      localStorage.setItem(namespacedKey, JSON.stringify(data));
      return { success: true };
    } catch (error) {
      logger.error('Failed to save to localStorage', { error, key });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Load data from localStorage
   * @param key Storage key
   */
  async load(key: string): Promise<StorageResult<T>> {
    try {
      const namespacedKey = this.getNamespacedKey(key);
      const data = localStorage.getItem(namespacedKey);
      
      if (data === null) {
        return { 
          success: false, 
          error: `Key not found: ${key}`
        };
      }
      
      return { 
        success: true, 
        data: JSON.parse(data) as T
      };
    } catch (error) {
      logger.error('Failed to load from localStorage', { error, key });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Delete data from localStorage
   * @param key Storage key
   */
  async delete(key: string): Promise<StorageResult<void>> {
    try {
      const namespacedKey = this.getNamespacedKey(key);
      localStorage.removeItem(namespacedKey);
      return { success: true };
    } catch (error) {
      logger.error('Failed to delete from localStorage', { error, key });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * List all keys in localStorage for this namespace
   */
  async listKeys(): Promise<StorageResult<string[]>> {
    try {
      const keys: string[] = [];
      const prefix = `${this.namespace}:`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key.substring(prefix.length));
        }
      }
      
      return { success: true, data: keys };
    } catch (error) {
      logger.error('Failed to list keys from localStorage', { error });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}
