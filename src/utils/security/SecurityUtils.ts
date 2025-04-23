
/**
 * Security utilities for form protection
 */

/**
 * Apply security measures to a form
 * @param form - The form element to secure
 */
export function secureForm(form: HTMLFormElement): void {
  if (!form) return;
  
  // Add CSRF token
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'csrf_token';
    tokenInput.value = csrfToken;
    form.appendChild(tokenInput);
  }
  
  // Apply other security measures
  form.setAttribute('autocomplete', 'off');
  form.setAttribute('novalidate', 'true');
}

/**
 * Get CSRF token from meta tag or cookie
 * @returns CSRF token string or null if not found
 */
export function getCSRFToken(): string | null {
  // Try to get from meta tag
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  if (metaTag && metaTag.getAttribute('content')) {
    return metaTag.getAttribute('content');
  }
  
  // Try to get from cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrf_token') {
      return decodeURIComponent(value);
    }
  }
  
  return null;
}

/**
 * Generate a secure token for client-side use
 * @returns Secure random token
 */
export function generateSecureToken(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Initialize security features for the application
 */
export function initializeSecurity(): void {
  // Set security headers via meta tags since we can't set HTTP headers directly from JS
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = "default-src 'self'; script-src 'self'; object-src 'none';";
  document.head.appendChild(cspMeta);
  
  // Add CSRF meta tag if not present
  if (!document.querySelector('meta[name="csrf-token"]')) {
    const csrfMeta = document.createElement('meta');
    csrfMeta.name = 'csrf-token';
    csrfMeta.content = generateSecureToken();
    document.head.appendChild(csrfMeta);
  }
}
