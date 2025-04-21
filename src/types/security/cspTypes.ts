
/**
 * Content Security Policy Types
 * 
 * This module provides type definitions for Content Security Policy (CSP)
 * related functionality.
 * 
 * @module types/security/cspTypes
 */

/**
 * Valid CSP directive names as defined in the CSP specification.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
 */
export type CspDirective =
  | 'default-src'
  | 'script-src'
  | 'style-src'
  | 'img-src'
  | 'font-src'
  | 'connect-src'
  | 'frame-src'
  | 'object-src'
  | 'base-uri'
  | 'form-action'
  | 'frame-ancestors'
  | 'block-all-mixed-content'
  | 'upgrade-insecure-requests'
  | 'report-uri';

/**
 * Type definition for a complete CSP configuration.
 * Maps each CSP directive to an array of allowed sources.
 */
export type CspConfig = Record<CspDirective, string[]>;

/**
 * Options for configuring CSP violation reporting
 */
export interface CspReportingOptions {
  /**
   * URI where CSP violation reports will be sent
   */
  reportUri: string;
  
  /**
   * Whether to send reports only (no enforcement)
   * @default false
   */
  reportOnly?: boolean;
  
  /**
   * Sample rate for violation reports (0-1)
   * @default 1
   */
  sampleRate?: number;
  
  /**
   * Maximum number of reports to send per session
   * @default undefined (no limit)
   */
  maxReports?: number;
}

/**
 * CSP violation report structure
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri
 */
export interface CspViolationReport {
  /**
   * Document URI where the violation occurred
   */
  'document-uri': string;
  
  /**
   * URI of the resource that violated the policy
   */
  'blocked-uri': string;
  
  /**
   * Directive that was violated
   */
  'violated-directive': string;
  
  /**
   * Original policy as specified in the Content-Security-Policy header
   */
  'original-policy': string;
  
  /**
   * Disposition of the violation (enforce or report)
   */
  'disposition'?: 'enforce' | 'report';
  
  /**
   * Referrer of the document
   */
  'referrer'?: string;
  
  /**
   * Status code of the HTTP response
   */
  'status-code'?: number;
}

/**
 * CSP violation event data
 */
export interface CspViolationEventData {
  /**
   * The CSP violation report
   */
  report: CspViolationReport;
  
  /**
   * Timestamp when the violation was reported
   */
  timestamp: number;
  
  /**
   * Whether the violation was blocked
   */
  blocked: boolean;
}
