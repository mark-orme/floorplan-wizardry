
/**
 * Cookie Security Utilities
 * Provides secure cookie handling with proper security attributes
 * @module utils/security/cookieSecurity
 */

interface CookieOptions {
  expires?: Date | number; // Date object or number of days
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean; // Only works on server-side
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number; // Seconds
}

/**
 * Set a cookie with security attributes
 * @param name Cookie name
 * @param value Cookie value
 * @param options Cookie options
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  // Default security options
  const secureOptions: CookieOptions = {
    path: '/',
    secure: window.location.protocol === 'https:', // Secure by default on HTTPS
    sameSite: 'lax', // Default to lax for most use cases
    ...options
  };
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  // Add expiration if provided
  if (secureOptions.expires) {
    if (typeof secureOptions.expires === 'number') {
      // Convert days to date
      const days = secureOptions.expires;
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      secureOptions.expires = date;
    }
    
    cookieString += `; expires=${secureOptions.expires.toUTCString()}`;
  }
  
  // Add max age if provided
  if (secureOptions.maxAge !== undefined) {
    cookieString += `; max-age=${secureOptions.maxAge}`;
  }
  
  // Add path
  if (secureOptions.path) {
    cookieString += `; path=${secureOptions.path}`;
  }
  
  // Add domain if provided
  if (secureOptions.domain) {
    cookieString += `; domain=${secureOptions.domain}`;
  }
  
  // Add secure flag
  if (secureOptions.secure) {
    cookieString += '; secure';
  }
  
  // Add SameSite attribute
  if (secureOptions.sameSite) {
    cookieString += `; samesite=${secureOptions.sameSite}`;
  }
  
  // Set the cookie
  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  const nameEquals = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    
    if (cookie.indexOf(nameEquals) === 0) {
      return decodeURIComponent(cookie.substring(nameEquals.length, cookie.length));
    }
  }
  
  return null;
}

/**
 * Delete a cookie by setting its expiration in the past
 * @param name Cookie name
 * @param options Cookie options
 */
export function deleteCookie(name: string, options: CookieOptions = {}): void {
  setCookie(name, '', {
    ...options,
    expires: -1, // Expire immediately
  });
}

/**
 * Create a secure session cookie
 * @param name Cookie name
 * @param value Cookie value
 */
export function setSecureSessionCookie(name: string, value: string): void {
  setCookie(name, value, {
    secure: true,
    sameSite: 'strict',
    path: '/'
  });
}

/**
 * Create a persistent cookie with secure attributes and specific expiration
 * @param name Cookie name
 * @param value Cookie value
 * @param days Number of days until expiration
 */
export function setSecurePersistentCookie(name: string, value: string, days: number): void {
  setCookie(name, value, {
    secure: true,
    sameSite: 'strict',
    path: '/',
    expires: days
  });
}
