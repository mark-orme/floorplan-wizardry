
/**
 * Sentry shared types
 * Type definitions for Sentry error reporting and monitoring
 * 
 * @module utils/sentry/types
 */

import * as Sentry from '@sentry/react';

/**
 * Options interface for error capture functions
 * Configures how errors are captured and reported to Sentry
 * 
 * @interface ErrorCaptureOptions
 */
export interface ErrorCaptureOptions {
  /** Severity level of the error or message */
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  
  /** Key-value pairs for categorizing the event */
  tags?: Record<string, string>;
  
  /** Additional context data to include with the event */
  extra?: Record<string, any>;
  
  /** User information to associate with the event */
  user?: {
    id?: string;
    email?: string;
    username?: string;
    ip_address?: string;
    [key: string]: any;
  };
  
  /** Whether to show the report dialog to the user */
  showReportDialog?: boolean;
  
  /** Whether to capture console output with the error */
  captureConsole?: boolean;
}

/**
 * Options interface for performance transactions
 * Configures how performance is monitored and reported
 * 
 * @interface TransactionOptions
 */
export interface TransactionOptions {
  /** Additional data to include with the transaction */
  data?: Record<string, any>;
  
  /** Key-value pairs for categorizing the transaction */
  tags?: Record<string, string>;
  
  /** Parent transaction or span reference */
  parentSpanId?: string;
  
  /** Optional start time override */
  startTime?: number;
}

/**
 * Interface for transaction result from startPerformanceTransaction
 * Provides methods to control and finalize the transaction
 * 
 * @interface TransactionResult
 */
export interface TransactionResult {
  /** 
   * Finish the transaction with optional status 
   * @param {string | number} [status] - Transaction status or HTTP status code
   */
  finish: (status?: string | number) => void;
  
  /** 
   * Update the transaction name
   * @param {string} name - New transaction name 
   */
  setName: (name: string) => void;
  
  /** 
   * Set the transaction status
   * @param {string} status - Transaction status
   */
  setStatus: (status: string) => void;
  
  /** 
   * Add a tag to the transaction
   * @param {string} key - Tag key
   * @param {string} value - Tag value
   */
  setTag: (key: string, value: string) => void;
  
  /** 
   * Add data to the transaction
   * @param {string} key - Data key
   * @param {any} value - Data value
   */
  setData: (key: string, value: any) => void;
}
