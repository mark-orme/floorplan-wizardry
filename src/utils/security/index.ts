
/**
 * Security Utilities Index
 * Centralized exports for all security-related functionality
 */

// Export content sanitization utilities
export * from './htmlSanitization';
export * from './contentSecurityPolicy';
export * from './httpSecurity';
export * from './inputSanitization';

// Create a unified Security namespace for easier imports
export const Security = {
  // HTML sanitization
  HTML: {
    sanitizeHtml: (html: string) => import('./htmlSanitization').then(m => m.sanitizeHtml(html)),
    sanitizeRichHtml: (html: string) => import('./htmlSanitization').then(m => m.sanitizeRichHtml(html)),
    sanitizeCanvasHtml: (html: string) => import('./htmlSanitization').then(m => m.sanitizeCanvasHtml(html))
  },
  
  // Input sanitization
  Input: {
    sanitizeHtml: (input: string) => import('./inputSanitization').then(m => m.sanitizeHtml(input)),
    sanitizeObject: <T extends Record<string, any>>(obj: T) => 
      import('./inputSanitization').then(m => m.sanitizeObject<T>(obj)),
    sanitizeUrl: (url: string) => import('./inputSanitization').then(m => m.sanitizeUrl(url)),
    stripJavaScriptEvents: (input: string) => import('./inputSanitization').then(m => m.stripJavaScriptEvents(input))
  },
  
  // File handling
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
    initializeCSP: () => import('./contentSecurityPolicy').then(m => m.initializeCSP()),
    getCSPHeaders: () => import('./contentSecurityPolicy').then(m => m.getCSPHeaders())
  },
  
  // HTTP security
  HTTP: {
    secureFetch: (url: string, options?: RequestInit) => 
      import('./httpSecurity').then(m => m.secureFetch(url, options)),
    applySecurityMetaTags: () => import('./httpSecurity').then(m => m.applySecurityMetaTags())
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
