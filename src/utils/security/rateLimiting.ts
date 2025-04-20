
/**
 * Rate Limiting Utilities
 * Provides client-side rate limiting to prevent abuse
 */

interface RateLimitOptions {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number; // Maximum requests allowed in the window
}

// Store for rate limits
const rateLimitStore: Record<string, {
  count: number;
  resetTime: number;
}> = {};

/**
 * Check if an action is rate limited
 * @param key Unique identifier for the rate limited action
 * @param options Rate limit options
 * @returns Boolean indicating if rate limited
 */
export function isRateLimited(key: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  
  // Initialize if this is a new key
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + options.windowMs
    };
    return false;
  }
  
  const entry = rateLimitStore[key];
  
  // Reset counter if window expired
  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + options.windowMs;
    return false;
  }
  
  // Increment count and check against limit
  entry.count++;
  
  // Check if rate limit exceeded
  return entry.count > options.maxRequests;
}

/**
 * Get current status of a rate limit
 * @param key Unique identifier for the rate limited action
 * @returns Status object or null if not found
 */
export function getRateLimitStatus(key: string): {
  remaining: number;
  resetIn: number;
} | null {
  if (!rateLimitStore[key]) {
    return null;
  }
  
  const entry = rateLimitStore[key];
  const now = Date.now();
  
  return {
    remaining: Math.max(0, entry.count),
    resetIn: Math.max(0, entry.resetTime - now)
  };
}

/**
 * Create a rate-limited function wrapper
 * @param fn Function to rate limit
 * @param key Rate limit key
 * @param options Rate limit options
 * @returns Rate limited function
 */
export function createRateLimitedFunction<T extends (...args: any[]) => any>(
  fn: T,
  key: string,
  options: RateLimitOptions
): (...args: Parameters<T>) => ReturnType<T> | null {
  return (...args: Parameters<T>): ReturnType<T> | null => {
    if (isRateLimited(key, options)) {
      console.warn(`Rate limit exceeded for ${key}`);
      return null;
    }
    
    return fn(...args);
  };
}
