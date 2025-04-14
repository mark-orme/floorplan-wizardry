/**
 * Input Sanitization Utilities
 * Provides utilities for sanitizing user input
 * @module utils/security/inputSanitization
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize input to prevent XSS attacks
 * @param input String to sanitize
 * @returns Sanitized string
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Use DOMPurify for comprehensive HTML sanitization
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // Strip all HTML tags by default
      ALLOWED_ATTR: []  // Strip all attributes
    });
  }
  
  // Fallback for non-browser environments or SSR
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize HTML allowing specific safe tags
 * @param html HTML string to sanitize
 * @param options Sanitization options
 * @returns Sanitized HTML
 */
export function sanitizeRichHtml(html: string, options: {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
} = {}): string {
  if (!html || typeof html !== 'string') return '';
  
  if (typeof window !== 'undefined') {
    const {
      allowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      allowedAttributes = { a: ['href', 'target', 'rel'] }
    } = options;
    
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto):)/i, // Only allow http, https, ftp, ftps, mailto protocols
      FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'frameset', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'option'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onmousemove', 'onkeydown', 'onkeyup', 'onkeypress'],
      ADD_ATTR: ['target="_blank"', 'rel="noopener noreferrer"'], // Security for links
      USE_PROFILES: { html: true }
    });
  }
  
  // Fallback sanitization for non-browser environments
  return sanitizeHtml(html);
}

/**
 * Sanitize an object's string properties recursively
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        result[key] = sanitizeHtml(value);
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize nested objects and arrays
        result[key] = Array.isArray(value) 
          ? value.map(item => typeof item === 'object' && item !== null ? sanitizeObject(item) : (typeof item === 'string' ? sanitizeHtml(item) : item))
          : sanitizeObject(value);
      } else {
        result[key] = value;
      }
    }
  }
  
  return result as T;
}

/**
 * Sanitize a URL for safe usage
 * @param url URL to sanitize
 * @param allowedProtocols Allowed protocols
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string, allowedProtocols: string[] = ['http:', 'https:']): string | null {
  if (!url || typeof url !== 'string') return null;
  
  try {
    // Parse the URL
    const parsedUrl = new URL(url);
    
    // Check if protocol is allowed
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return null;
    }
    
    return parsedUrl.toString();
  } catch (error) {
    // Invalid URL
    return null;
  }
}

/**
 * Strip JavaScript event handlers from a string
 * @param input String to sanitize
 * @returns Sanitized string
 */
export function stripJavaScriptEvents(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove common JS event handlers
  return input.replace(/on\w+(\s*)=(\s*)['"](.*?)['"]/g, '');
}

/**
 * Remove JavaScript from CSS to prevent CSS-based attacks
 * @param css CSS string to sanitize
 * @returns Sanitized CSS
 */
export function sanitizeCSS(css: string): string {
  if (!css || typeof css !== 'string') return '';
  
  // Remove potentially dangerous CSS constructs
  return css
    .replace(/expression\s*\(.*\)/g, '') // Remove CSS expressions
    .replace(/@import/g, '') // Remove imports
    .replace(/javascript:/g, '') // Remove javascript: protocol
    .replace(/behavior:/g, '') // Remove behavior
    .replace(/binding:/g, '') // Remove binding
    .replace(/-moz-binding:/g, ''); // Remove Mozilla binding
}

/**
 * Create a safe display name from user input
 * @param input User input for display name
 * @returns Sanitized display name
 */
export function createSafeDisplayName(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML, limit length, and only allow certain characters
  return sanitizeHtml(input)
    .trim()
    .replace(/[^\w\s.,'-]/g, '')
    .substring(0, 100);
}

/**
 * Sanitize user input for use in SQL queries
 * This is a defense-in-depth measure; parameterized queries should still be used
 * @param input Input string to sanitize
 * @returns Sanitized string safe for SQL
 */
export function sanitizeSqlInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove SQL injection patterns
  return input
    .replace(/'/g, "''")                // Escape single quotes
    .replace(/--/g, '')                 // Remove comment markers
    .replace(/;/g, '')                  // Remove semicolons
    .replace(/\/\*/g, '')               // Remove comment starts
    .replace(/\*\//g, '')               // Remove comment ends
    .replace(/xp_/gi, '')               // Remove potential exec prefixes
    .replace(/EXEC\s+/gi, '')           // Remove EXEC statements
    .replace(/EXECUTE\s+/gi, '')        // Remove EXECUTE statements
    .replace(/SELECT\s+.*\s+FROM/gi, '') // Remove SELECT statements
    .replace(/INSERT\s+INTO/gi, '')     // Remove INSERT statements
    .replace(/UPDATE\s+.+\s+SET/gi, '')  // Remove UPDATE statements
    .replace(/DELETE\s+FROM/gi, '')     // Remove DELETE statements
    .replace(/DROP\s+/gi, '')           // Remove DROP statements
    .replace(/UNION\s+ALL/gi, '')       // Remove UNION statements
    .replace(/OR\s+\d+=\d+/gi, '')      // Remove OR true conditions
    .replace(/OR\s+'.*'='.*'/gi, '');   // Remove OR string conditions
}

/**
 * Sanitize and validate a JSON string
 * @param jsonString JSON string to sanitize
 * @returns Parsed and sanitized JSON object or null if invalid
 */
export function sanitizeJsonString<T>(jsonString: string): T | null {
  if (!jsonString || typeof jsonString !== 'string') return null;
  
  try {
    // First sanitize the string to prevent XSS
    const sanitized = sanitizeHtml(jsonString);
    
    // Parse the JSON
    const parsed = JSON.parse(sanitized);
    
    // Sanitize all string properties in the parsed object
    return sanitizeObject(parsed) as T;
  } catch (error) {
    console.error('Error sanitizing JSON string:', error);
    return null;
  }
}
