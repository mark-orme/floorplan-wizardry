
/**
 * Sentry types module
 * Defines types for Sentry error reporting
 * @module utils/sentry/types
 */

/**
 * Sentry error capture options
 */
export interface ErrorCaptureOptions {
  /** Error level */
  level?: 'error' | 'warning' | 'info';
  /** Tags to attach to error */
  tags?: Record<string, string>;
  /** Extra data to attach to error */
  extra?: Record<string, any>;
  /** User information */
  user?: {
    /** User ID */
    id?: string;
    /** User email */
    email?: string;
    /** Username */
    username?: string;
    /** IP address */
    ip_address?: string;
    /** User metadata */
    [key: string]: any;
  };
  /** Whether to show the report dialog */
  showReportDialog?: boolean;
}

/**
 * Sentry performance transaction options
 */
export interface TransactionOptions {
  /** Tags to attach to transaction */
  tags?: Record<string, string>;
  /** Transaction data */
  data?: Record<string, any>;
}

/**
 * Sentry performance transaction result
 */
export interface TransactionResult {
  /** Finish the transaction */
  finish: (status?: string | number) => void;
  /** Set transaction name */
  setName: (name: string) => void;
  /** Set transaction status */
  setStatus: (status: string) => void;
  /** Set tag on transaction */
  setTag: (key: string, value: string) => void;
  /** Set data on transaction */
  setData: (key: string, value: any) => void;
}
