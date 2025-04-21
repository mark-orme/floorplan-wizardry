
/**
 * Storage Adapter Interface
 * Defines the contract for storage adapters
 */

import { StorageResult } from './storageResult';

/**
 * Interface for storage adapters
 */
export interface StorageAdapter {
  /**
   * Get an item from storage
   */
  getItem<T>(key: string): Promise<StorageResult<T>>;
  
  /**
   * Set an item in storage
   */
  setItem<T>(key: string, value: T): Promise<StorageResult<void>>;
  
  /**
   * Remove an item from storage
   */
  removeItem(key: string): Promise<StorageResult<void>>;
  
  /**
   * Clear all items from storage
   */
  clear(): Promise<StorageResult<void>>;
  
  /**
   * Get all keys in storage
   */
  keys(): Promise<StorageResult<string[]>>;
}
