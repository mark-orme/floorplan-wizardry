
/**
 * Storage Result Interface
 * Defines the result format for storage operations
 */

/**
 * Result type for storage operations
 */
export interface StorageResult<T> {
  /**
   * Whether the operation was successful
   */
  success: boolean;
  
  /**
   * Result data if successful
   */
  data?: T;
  
  /**
   * Error message if not successful
   */
  error?: string;
}
