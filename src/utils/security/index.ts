/**
 * Security Utilities Index
 * Centralized exports for all security-related functionality
 */

// Import from HttpSecurityUtils with explicit naming to avoid conflicts
import { 
  secureFetch as httpSecureFetch,
  addSecurityHeaders as httpAddSecurityHeaders,
  isConnectionSecure as httpIsConnectionSecure,
  getCSPHeaders as httpGetCSPHeaders
} from './HttpSecurityUtils';

// Import from ContentSecurityPolicy
import {
  initializeCSP,
  checkCSPApplied,
  fixSentryCSP,
  MASTER_CSP_STRING
} from './contentSecurityPolicy';

// Import from httpSecurity
import {
  applySecurityMetaTags
} from './httpSecurity';

// Import from InputSanitizationUtils
import {
  sanitizeHtml,
  sanitizeObject,
  sanitizeUrl,
  stripJavaScriptEvents
} from './InputSanitizationUtils';

// Import from FileSecurityUtils
import {
  sanitizeFileName,
  createSecureFileUploadHandler
} from './FileSecurityUtils';

// Import from SecurityUtils
import {
  secureForm,
  initializeSecurity
} from './SecurityUtils';

// Import from htmlSanitization with explicit naming to avoid conflicts
import { 
  sanitizeHtml as sanitizeHtmlContent, 
  sanitizeRichHtml as sanitizeRichHtmlContent 
} from './htmlSanitization';

// Direct exports with explicit naming
export { 
  // From HttpSecurityUtils
  httpSecureFetch as secureFetch,
  httpAddSecurityHeaders as addSecurityHeaders,
  httpIsConnectionSecure as isConnectionSecure,
  httpGetCSPHeaders as getCSPHeaders,
  
  // From ContentSecurityPolicy
  initializeCSP,
  checkCSPApplied,
  fixSentryCSP,
  MASTER_CSP_STRING,
  
  // From httpSecurity
  applySecurityMetaTags,
  
  // From htmlSanitization
  sanitizeHtmlContent, 
  sanitizeRichHtmlContent,
  
  // From InputSanitizationUtils
  sanitizeHtml,
  sanitizeObject,
  sanitizeUrl,
  stripJavaScriptEvents,
  
  // From FileSecurityUtils
  sanitizeFileName,
  createSecureFileUploadHandler,
  
  // From SecurityUtils
  secureForm,
  initializeSecurity
};

// Create a unified Security namespace for easier imports
export const Security = {
  // HTML sanitization
  HTML: {
    sanitizeHtml: (html: string) => {
      if (!html || typeof html !== 'string') return '';
      return html.replace(/<\/?[^>]+(>|$)/g, '');
    },
    sanitizeRichHtml: (html: string) => {
      if (!html || typeof html !== 'string') return '';
      return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    },
    sanitizeCanvasHtml: (html: string) => {
      if (!html || typeof html !== 'string') return '';
      return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
  },
  
  // Input sanitization - reusing the refactored functions
  Input: {
    sanitizeHtml: sanitizeHtml,
    sanitizeObject: sanitizeObject,
    sanitizeUrl: sanitizeUrl,
    stripJavaScriptEvents: stripJavaScriptEvents
  },
  
  // Files handling - using the new refactored module
  Files: {
    sanitizeFileName: sanitizeFileName,
    createSecureFileUploadHandler: createSecureFileUploadHandler
  },
  
  // CSP utilities - reuse existing implementation
  CSP: {
    initializeCSP: () => {
      if (typeof document !== 'undefined') {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'";
        document.head.appendChild(meta);
      }
    },
    getCSPHeaders: httpGetCSPHeaders
  },
  
  // HTTP security - reusing refactored functions
  HTTP: {
    secureFetch: httpSecureFetch,
    applySecurityMetaTags: () => {
      if (typeof document !== 'undefined') {
        // Define security meta tags (removing X-Frame-Options which must be set via HTTP header)
        const securityTags = [
          { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
          { name: 'referrer', content: 'no-referrer' }
        ];
        
        // Add meta tags to document head
        securityTags.forEach(tagData => {
          const meta = document.createElement('meta');
          if (tagData.httpEquiv) {
            meta.httpEquiv = tagData.httpEquiv;
          }
          if (tagData.name) {
            meta.setAttribute('name', tagData.name);
          }
          meta.content = tagData.content;
          document.head.appendChild(meta);
        });
      }
    }
  },
  
  // CSRF protection - using existing csrfProtection module
  CSRF: {
    getCsrfToken: () => {
      return `csrf-${Math.random().toString(36).substring(2, 15)}`;
    },
    
    validateCsrfToken: (token: string, storedToken: string) => {
      return token === storedToken;
    }
  }
};
