
/**
 * CSRF protection utilities
 */

/**
 * Get CSRF token from cookie or meta tag
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
 * Generate a secure token for CSRF protection
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Initialize CSRF protection
 */
export function initializeCSRFProtection(): void {
  // If no CSRF token exists, create one
  if (!getCSRFToken()) {
    const token = generateCSRFToken();
    
    // Set as meta tag
    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    meta.content = token;
    document.head.appendChild(meta);
    
    // Set as cookie (httpOnly and sameSite in production)
    document.cookie = `csrf_token=${token}; path=/; max-age=86400`;
  }
}
