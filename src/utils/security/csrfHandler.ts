
/**
 * Get CSRF token from meta tag or cookie
 * This provides protection against Cross-Site Request Forgery
 */
export const getCSRFToken = (): string | null => {
  // Check for CSRF token in cookie
  function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
  
  // Check for token in meta tag
  function getMetaToken(): string | null {
    if (typeof document === 'undefined') return null;
    
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? (metaTag as HTMLMetaElement).content : null;
  }
  
  // Get token from either source
  const token = getCookie('XSRF-TOKEN') || getMetaToken();
  
  // Generate a token if none exists (for demo purposes only)
  if (!token && typeof document !== 'undefined') {
    const generatedToken = Math.random().toString(36).substring(2, 15);
    document.cookie = `XSRF-TOKEN=${generatedToken}; path=/; SameSite=Strict`;
    
    // Also add a meta tag
    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    meta.content = generatedToken;
    document.head.appendChild(meta);
    
    return generatedToken;
  }
  
  return token;
};

/**
 * Add CSRF token to headers for fetch/axios requests
 */
export const addCSRFToHeaders = (headers: Record<string, string> = {}): Record<string, string> => {
  const token = getCSRFToken();
  if (token) {
    return {
      ...headers,
      'X-CSRF-Token': token,
      'X-XSRF-Token': token
    };
  }
  return headers;
};
