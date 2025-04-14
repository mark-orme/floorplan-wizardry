/**
 * Security Utilities Index
 * Centralizes security features for the application
 * @module utils/security
 */

// Export all security features
export * from './csrfProtection';
export * from './cookieSecurity';
export * from './fileUploadSecurity';
export * from './inputSanitization';
export * from './rateLimiting';
export * from './authorizationChecks';
export * from './httpSecurity';

// Export a convenience object for importing all security features
import * as CSRFProtection from './csrfProtection';
import * as CookieSecurity from './cookieSecurity';
import * as FileUploadSecurity from './fileUploadSecurity';
import * as InputSanitization from './inputSanitization';
import * as RateLimiting from './rateLimiting';
import * as AuthorizationChecks from './authorizationChecks';
import * as HttpSecurity from './httpSecurity';

export const Security = {
  CSRF: CSRFProtection,
  Cookies: CookieSecurity,
  Files: FileUploadSecurity,
  Input: InputSanitization,
  RateLimit: RateLimiting,
  Auth: AuthorizationChecks,
  Http: HttpSecurity,
  isSecureConnection: (): boolean => 
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
};

/**
 * Perform security initialization on app startup
 */
export function initializeSecurity(): void {
  // Apply security meta tags
  HttpSecurity.applySecurityMetaTags();
  
  // Initialize other security features
  console.info('Frontend security initialized');
}

/**
 * Check if the current connection uses HTTPS
 * @returns Whether the connection is secure
 */
export function isSecureConnection(): boolean {
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
}

/**
 * Apply security measures to a form element
 * @param form Form element to secure
 */
export function secureForm(form: HTMLFormElement): void {
  // Apply CSRF protection
  CSRFProtection.protectForm(form);
  
  // Add novalidate to use our own validation
  form.setAttribute('novalidate', 'true');
  
  // Ensure proper enctype for file uploads
  const hasFileInputs = form.querySelector('input[type="file"]') !== null;
  if (hasFileInputs && !form.getAttribute('enctype')) {
    form.setAttribute('enctype', 'multipart/form-data');
  }
}

/**
 * Secure an HTML element by sanitizing its content
 * @param element HTML element to secure
 */
export function secureHtmlElement(element: HTMLElement): void {
  // Sanitize any existing content
  const content = element.innerHTML;
  element.innerHTML = InputSanitization.sanitizeRichHtml(content);
  
  // Add mutation observer to sanitize dynamically added content
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        const container = document.createElement('div');
        
        // Process each added node
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            container.appendChild(element.cloneNode(true));
          }
        });
        
        // Sanitize the entire container
        const sanitized = InputSanitization.sanitizeRichHtml(container.innerHTML);
        
        // Replace the original content with sanitized content
        element.innerHTML = sanitized;
      }
    });
  });
  
  // Start observing
  observer.observe(element, { childList: true, subtree: true });
}

/**
 * Create a security-enhanced fetch function with automatic error handling
 * @param baseUrl Base URL for API requests
 * @returns Enhanced fetch function
 */
export function createSecureFetch(baseUrl: string = '') {
  return async <T>(
    endpoint: string, 
    options: RequestInit = {}, 
    errorHandler?: (error: Error) => void
  ): Promise<T | null> => {
    try {
      const url = `${baseUrl}${endpoint}`;
      const response = await HttpSecurity.secureFetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error('Secure fetch error:', error);
      if (errorHandler && error instanceof Error) {
        errorHandler(error);
      }
      return null;
    }
  };
}
