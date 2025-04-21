
/**
 * CSRF Protection Handler
 * Provides utilities for Cross-Site Request Forgery protection
 */

// Generate a secure random token
function generateSecureToken(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Initialize CSRF protection with meta tags
export function initializeCSRFProtection(): void {
  if (typeof document === 'undefined') return;
  
  // Generate CSRF token
  const token = generateSecureToken();
  
  // Remove any existing CSRF meta tags
  const existingMeta = document.querySelector('meta[name="csrf-token"]');
  if (existingMeta) {
    existingMeta.remove();
  }
  
  // Add CSRF token meta tag
  const metaTag = document.createElement('meta');
  metaTag.setAttribute('name', 'csrf-token');
  metaTag.setAttribute('content', token);
  document.head.appendChild(metaTag);
  
  // Store in localStorage for verification
  localStorage.setItem('csrf-token', token);
  
  // Apply to all forms automatically
  applyCSRFToForms();
  
  // Monitor for new forms added to the DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const forms = document.querySelectorAll('form:not([data-csrf-protected])');
        // Properly cast the NodeList to the expected type
        if (forms.length > 0) {
          applyCSRFToForms(forms as unknown as NodeListOf<HTMLFormElement>);
        }
      }
    });
  });
  
  // Observe the entire document for new forms
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Intercept fetch requests to add CSRF header
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    init = init || {};
    init.headers = init.headers || {};
    
    // Add CSRF token to headers for non-GET requests
    const method = init.method || 'GET';
    if (method.toUpperCase() !== 'GET') {
      const headers = new Headers(init.headers);
      headers.append('X-CSRF-Token', getCSRFToken());
      init.headers = headers;
    }
    
    return originalFetch.call(this, input, init);
  };
  
  console.log('CSRF protection initialized');
}

// Get the current CSRF token
export function getCSRFToken(): string {
  if (typeof document === 'undefined') return '';
  
  // Try to get from meta tag first
  const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (metaToken) return metaToken;
  
  // Fall back to localStorage
  return localStorage.getItem('csrf-token') || '';
}

// Apply CSRF token to forms
function applyCSRFToForms(forms?: NodeListOf<HTMLFormElement>): void {
  if (typeof document === 'undefined') return;
  
  const token = getCSRFToken();
  if (!token) return;
  
  // Get all forms or use provided forms
  const allForms: NodeListOf<HTMLFormElement> = forms || document.querySelectorAll<HTMLFormElement>('form:not([data-csrf-protected])');
  
  allForms.forEach(form => {
    // Don't process the same form twice
    if (form.getAttribute('data-csrf-protected') === 'true') return;
    
    // Create input with CSRF token
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'csrf-token';
    input.value = token;
    
    // Add input to form
    form.appendChild(input);
    
    // Mark form as protected
    form.setAttribute('data-csrf-protected', 'true');
  });
}

// Verify a CSRF token matches the stored one
export function verifyCSRFToken(token: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const storedToken = localStorage.getItem('csrf-token');
  const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  
  return (storedToken === token) || (metaToken === token);
}

// Generate and set a new CSRF token
export function regenerateCSRFToken(): string {
  const newToken = generateSecureToken();
  
  if (typeof document !== 'undefined') {
    // Update meta tag
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      metaTag.setAttribute('content', newToken);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.setAttribute('name', 'csrf-token');
      newMeta.setAttribute('content', newToken);
      document.head.appendChild(newMeta);
    }
  }
  
  // Update localStorage
  localStorage.setItem('csrf-token', newToken);
  
  // Update forms
  applyCSRFToForms();
  
  return newToken;
}
