/**
 * Rate Limiting Utilities
 * Provides client-side rate limiting to prevent abuse
 * @module utils/security/rateLimiting
 */

interface RateLimitOptions {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number; // Maximum requests allowed in the window
  blockDuration?: number; // How long to block if limit exceeded (ms)
}

interface RateLimitRecord {
  count: number;
  firstRequest: number;
  lastRequest: number;
  blocked?: boolean;
  blockedUntil?: number;
}

// Store rate limit records
const rateLimiters: Record<string, RateLimitRecord> = {};

/**
 * Check if an action is rate limited
 * @param key Unique identifier for the rate limited action
 * @param options Rate limiting options
 * @returns Whether the action is currently rate limited
 */
export function isRateLimited(key: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  
  // Initialize if this is a new key
  if (!rateLimiters[key]) {
    rateLimiters[key] = {
      count: 1,
      firstRequest: now,
      lastRequest: now
    };
    return false;
  }
  
  const record = rateLimiters[key];
  
  // Check if currently blocked
  if (record.blocked && record.blockedUntil && now < record.blockedUntil) {
    // Update last request time
    record.lastRequest = now;
    return true;
  }
  
  // Reset count if outside window
  if (now - record.firstRequest > options.windowMs) {
    record.count = 1;
    record.firstRequest = now;
    record.lastRequest = now;
    record.blocked = false;
    delete record.blockedUntil;
    return false;
  }
  
  // Increment count and check against limit
  record.count++;
  record.lastRequest = now;
  
  // Block if limit exceeded
  if (record.count > options.maxRequests) {
    record.blocked = true;
    record.blockedUntil = now + (options.blockDuration || options.windowMs);
    return true;
  }
  
  return false;
}

/**
 * Get information about current rate limit status
 * @param key Unique identifier for the rate limited action
 * @returns Rate limit status or null if not found
 */
export function getRateLimitStatus(key: string): {
  remaining: number;
  reset: number;
  blocked: boolean;
} | null {
  if (!rateLimiters[key]) {
    return null;
  }
  
  const record = rateLimiters[key];
  const now = Date.now();
  
  // If blocked, return block info
  if (record.blocked && record.blockedUntil && now < record.blockedUntil) {
    return {
      remaining: 0,
      reset: record.blockedUntil,
      blocked: true
    };
  }
  
  // If in an active window, calculate remaining
  if (now - record.firstRequest <= options.windowMs) {
    return {
      remaining: Math.max(0, options.maxRequests - record.count),
      reset: record.firstRequest + options.windowMs,
      blocked: false
    };
  }
  
  // Window expired, reset would have happened on next attempt
  return {
    remaining: options.maxRequests,
    reset: now,
    blocked: false
  };
}

/**
 * Reset rate limiting for a specific key
 * @param key Key to reset
 */
export function resetRateLimit(key: string): void {
  delete rateLimiters[key];
}

/**
 * Rate limiting options for different action types
 */
export const options = {
  loginAttempts: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 login attempts
    blockDuration: 30 * 60 * 1000, // 30 minute block
  },
  formSubmissions: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 submissions per minute
    blockDuration: 2 * 60 * 1000, // 2 minute block
  },
  apiRequests: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute (1 per second average)
    blockDuration: 1 * 60 * 1000, // 1 minute block
  }
};

/**
 * Create a rate-limited function wrapper
 * @param fn Function to rate limit
 * @param key Rate limit key
 * @param options Rate limit options
 * @param onLimited Function to call when rate limited
 * @returns Rate limited function
 */
export function createRateLimitedFunction<T extends (...args: any[]) => any>(
  fn: T,
  key: string,
  options: RateLimitOptions,
  onLimited?: () => void
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    if (isRateLimited(key, options)) {
      if (onLimited) {
        onLimited();
      }
      return undefined;
    }
    
    return fn(...args);
  };
}
