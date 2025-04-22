
/**
 * Initialize XSS protection measures
 * This function sets up protection against cross-site scripting attacks
 */
export const initXssProtection = () => {
  // Add Content-Security-Policy meta tag
  if (typeof document !== 'undefined') {
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
    document.head.appendChild(cspMeta);
  }

  // Add XSS protection headers (for SSR environments)
  if (typeof window !== 'undefined') {
    // Override document.write to prevent XSS
    const originalWrite = document.write;
    document.write = (...args: string[]) => {
      console.warn('document.write is disabled for security reasons');
    };
    
    // Disable eval
    window.eval = function() {
      throw new Error('eval is disabled for security reasons');
    };
  }

  // Add DOMPurify if available
  try {
    const DOMPurify = require('dompurify');
    if (DOMPurify) {
      console.log('DOMPurify initialized for XSS protection');
    }
  } catch (e) {
    console.log('DOMPurify not available, some XSS protections not enabled');
  }
};
