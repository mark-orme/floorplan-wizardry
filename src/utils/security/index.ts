
/**
 * Security Utilities Index
 * Centralized exports for all security-related functionality
 */

// Export content sanitization utilities
export * from './contentSecurityPolicy';
export * from './httpSecurity';

// Export from HTML sanitization with explicit naming to avoid conflicts
import { sanitizeHtml as sanitizeHtmlContent, sanitizeRichHtml as sanitizeRichHtmlContent } from './htmlSanitization';
export { 
  sanitizeHtmlContent, 
  sanitizeRichHtmlContent
};

// Export from input sanitization with explicit naming to avoid conflicts
import { sanitizeHtml as sanitizeInputHtml } from './inputSanitization';
export { 
  sanitizeInputHtml
};

// Re-export other functions from inputSanitization
export { 
  sanitizeObject,
  sanitizeUrl,
  stripJavaScriptEvents
} from './inputSanitization';

// Create a unified Security namespace for easier imports
export const Security = {
  // HTML sanitization
  HTML: {
    sanitizeHtml: (html: string) => {
      // Simple synchronous implementation
      if (!html || typeof html !== 'string') return '';
      return html.replace(/<\/?[^>]+(>|$)/g, '');
    },
    sanitizeRichHtml: (html: string) => {
      // Simple synchronous implementation that preserves safe tags
      if (!html || typeof html !== 'string') return '';
      return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    },
    sanitizeCanvasHtml: (html: string) => {
      // Simple synchronous implementation for canvas content
      if (!html || typeof html !== 'string') return '';
      return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
  },
  
  // Input sanitization
  Input: {
    sanitizeHtml: (input: string) => {
      if (!input || typeof input !== 'string') return '';
      return input.replace(/<\/?[^>]+(>|$)/g, '');
    },
    sanitizeObject: <T extends Record<string, any>>(obj: T): T => {
      if (!obj || typeof obj !== 'object') return {} as T;
      const sanitized = {} as T;
      
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          
          if (typeof value === 'string') {
            sanitized[key] = value.replace(/<\/?[^>]+(>|$)/g, '') as any;
          } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = Security.Input.sanitizeObject(value);
          } else {
            sanitized[key] = value;
          }
        }
      }
      
      return sanitized;
    },
    sanitizeUrl: (url: string) => {
      if (!url || typeof url !== 'string') return '';
      
      // Only allow http:, https: and mailto: protocols
      if (!/^(https?|mailto):/i.test(url)) {
        return '';
      }
      
      // Remove any potentially harmful characters
      return url.replace(/[^\w:/?=#&%~.@!$'()*+,;[\]-]/gi, '');
    },
    stripJavaScriptEvents: (input: string) => {
      if (!input || typeof input !== 'string') return '';
      
      // Remove JavaScript event handlers (onclick, onload, etc.)
      return input.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^>\s]*)/gi, '');
    }
  },
  
  // Files handling
  Files: {
    sanitizeFileName: (fileName: string) => {
      if (!fileName || typeof fileName !== 'string') return '';
      // Remove path traversal sequences and potentially dangerous characters
      return fileName
        .replace(/[/\\?%*:|"<>]/g, '_') // Replace unsafe characters with underscore
        .replace(/\.{2,}/g, '.'); // Replace multiple dots with a single dot
    },
    
    // Secure file upload handler
    createSecureFileUploadHandler: (
      onValidFile: (file: File, sanitizedName: string) => void,
      onInvalidFile: (error: string) => void,
      options: {
        allowedTypes?: string[];
        allowedExtensions?: string[];
        maxSizeBytes?: number;
        validateContent?: boolean;
      } = {}
    ) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        const { 
          allowedTypes = [],
          allowedExtensions = [],
          maxSizeBytes = 5 * 1024 * 1024, // 5MB default
          validateContent = true
        } = options;
        
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        Array.from(files).forEach(file => {
          // Check file size
          if (file.size > maxSizeBytes) {
            onInvalidFile(`File too large: ${file.name}`);
            return;
          }
          
          // Check file type if specified
          if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
            onInvalidFile(`Invalid file type: ${file.type}`);
            return;
          }
          
          // Check extension if specified
          if (allowedExtensions.length > 0) {
            const extension = file.name.split('.').pop()?.toLowerCase() || '';
            if (!allowedExtensions.includes(extension)) {
              onInvalidFile(`Invalid file extension: ${extension}`);
              return;
            }
          }
          
          // Validate file name
          const sanitizedFileName = Security.Files.sanitizeFileName(file.name);
          
          // Content validation would normally go here (e.g. checking for malicious content)
          // For now, we'll accept the file if we've made it this far
          onValidFile(file, sanitizedFileName);
        });
      };
    }
  },
  
  // CSP utilities
  CSP: {
    initializeCSP: () => {
      // Implement CSP initialization synchronously
      if (typeof document !== 'undefined') {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'";
        document.head.appendChild(meta);
      }
    },
    getCSPHeaders: () => {
      return {
        'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'"
      };
    }
  },
  
  // HTTP security
  HTTP: {
    secureFetch: (url: string, options?: RequestInit) => {
      // Add security headers to fetch
      const secureOptions = options || {};
      secureOptions.headers = secureOptions.headers || {};
      
      // Add CSRF token if available
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const token = window.sessionStorage.getItem('csrf_token');
        if (token && secureOptions.headers instanceof Headers) {
          secureOptions.headers.append('X-CSRF-Token', token);
        } else if (token && typeof secureOptions.headers === 'object') {
          secureOptions.headers = {
            ...secureOptions.headers,
            'X-CSRF-Token': token
          };
        }
      }
      
      return fetch(url, secureOptions);
    },
    applySecurityMetaTags: () => {
      if (typeof document !== 'undefined') {
        // Add security meta tags
        const securityTags = [
          { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
          { httpEquiv: 'X-Frame-Options', content: 'DENY' },
          { name: 'referrer', content: 'no-referrer' }
        ];
        
        securityTags.forEach(tagData => {
          const meta = document.createElement('meta');
          Object.entries(tagData).forEach(([key, value]) => {
            meta[key as keyof HTMLMetaElement] = value;
          });
          document.head.appendChild(meta);
        });
      }
    }
  },
  
  // CSRF protection
  CSRF: {
    getCsrfToken: () => {
      // This would typically generate or retrieve a CSRF token
      // For now, we'll use a simple implementation
      return `csrf-${Math.random().toString(36).substring(2, 15)}`;
    },
    
    validateCsrfToken: (token: string, storedToken: string) => {
      return token === storedToken;
    }
  }
};

/**
 * Initialize all security features
 * Call this during application startup
 */
export function initializeSecurity(): void {
  if (typeof window !== 'undefined') {
    // Initialize Content Security Policy
    Security.CSP.initializeCSP();
    
    // Apply security-related meta tags
    Security.HTTP.applySecurityMetaTags();
    
    // Add no-referrer meta tag
    const metaReferrer = document.createElement('meta');
    metaReferrer.name = 'referrer';
    metaReferrer.content = 'no-referrer';
    document.head.appendChild(metaReferrer);
    
    // Block iframe embedding via CSP
    const metaFrameOptions = document.createElement('meta');
    metaFrameOptions.httpEquiv = 'X-Frame-Options';
    metaFrameOptions.content = 'DENY';
    document.head.appendChild(metaFrameOptions);
    
    console.info('Security features initialized');
  }
}

/**
 * Apply security measures to a form element
 * @param form Form element to secure
 */
export function secureForm(form: HTMLFormElement): void {
  // Add CSRF token
  const csrfToken = Security.CSRF.getCsrfToken();
  
  // Store token in a hidden field
  const tokenInput = document.createElement('input');
  tokenInput.type = 'hidden';
  tokenInput.name = 'csrf_token';
  tokenInput.value = csrfToken;
  form.appendChild(tokenInput);
  
  // Store in session storage for validation
  try {
    sessionStorage.setItem('csrf_token', csrfToken);
  } catch (e) {
    console.error('Failed to store CSRF token');
  }
  
  // Add event listener to sanitize inputs on submit
  form.addEventListener('submit', (e) => {
    const formData = new FormData(form);
    const hasInvalidData = Array.from(formData.entries()).some(([key, value]) => {
      if (typeof value === 'string' && value.includes('<script')) {
        console.error(`Potentially malicious input detected in field: ${key}`);
        e.preventDefault();
        return true;
      }
      return false;
    });
    
    if (hasInvalidData) {
      console.error('Form submission blocked due to potentially malicious input');
      e.preventDefault();
    }
  });
}
