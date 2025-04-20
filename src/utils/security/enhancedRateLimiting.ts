
/**
 * Enhanced Rate Limiting Utilities
 * 
 * Provides client-side rate limiting to prevent API abuse
 */
import { toast } from 'sonner';

interface RateLimitOptions {
  maxRequests: number;  // Maximum number of requests allowed
  windowMs: number;     // Time window in milliseconds
  blockDuration: number; // Duration to block after exceeding limit (ms)
}

// Default options
export const rateLimitOptions: RateLimitOptions = {
  maxRequests: 60,
  windowMs: 60000,   // 1 minute
  blockDuration: 300000 // 5 minutes
};

// Store for rate limits
interface RateLimitStore {
  [key: string]: {
    requests: number;
    resetTime: number;
    blocked: boolean;
    blockUntil: number;
  };
}

const rateLimitStore: RateLimitStore = {};

/**
 * Check if a resource is rate limited
 * @param resourceKey Key to identify the resource
 * @param options Rate limit options
 * @returns Boolean indicating if rate limited
 */
export function isRateLimited(
  resourceKey: string,
  options: Partial<RateLimitOptions> = {}
): boolean {
  const opts = { ...rateLimitOptions, ...options };
  const now = Date.now();
  
  // Initialize store entry if it doesn't exist
  if (!rateLimitStore[resourceKey]) {
    rateLimitStore[resourceKey] = {
      requests: 0,
      resetTime: now + opts.windowMs,
      blocked: false,
      blockUntil: 0
    };
  }
  
  const entry = rateLimitStore[resourceKey];
  
  // Check if currently blocked
  if (entry.blocked) {
    if (now > entry.blockUntil) {
      // Block duration expired, reset
      entry.blocked = false;
      entry.requests = 0;
      entry.resetTime = now + opts.windowMs;
    } else {
      // Still blocked
      return true;
    }
  }
  
  // Reset counter if window expired
  if (now > entry.resetTime) {
    entry.requests = 0;
    entry.resetTime = now + opts.windowMs;
  }
  
  // Increment request counter
  entry.requests++;
  
  // Check if rate limit exceeded
  if (entry.requests > opts.maxRequests) {
    console.warn(`Rate limit exceeded for ${resourceKey}. Blocking for ${opts.blockDuration}ms`);
    toast.error(`Too many requests. Please try again in ${Math.ceil(opts.blockDuration / 1000)} seconds.`);
    entry.blocked = true;
    entry.blockUntil = now + opts.blockDuration;
    return true;
  }
  
  return false;
}

/**
 * Get current status of a rate limit
 * @param resourceKey Key to identify the resource
 * @returns Status object or null if not found
 */
export function getRateLimitStatus(resourceKey: string): {
  remaining: number;
  isBlocked: boolean;
  resetIn: number;
  blockRemaining: number;
} | null {
  if (!rateLimitStore[resourceKey]) {
    return null;
  }
  
  const entry = rateLimitStore[resourceKey];
  const now = Date.now();
  
  return {
    remaining: Math.max(0, rateLimitOptions.maxRequests - entry.requests),
    isBlocked: entry.blocked,
    resetIn: Math.max(0, entry.resetTime - now),
    blockRemaining: Math.max(0, entry.blockUntil - now)
  };
}

/**
 * Reset rate limit for a resource
 * @param resourceKey Key to identify the resource
 */
export function resetRateLimit(resourceKey: string): void {
  if (rateLimitStore[resourceKey]) {
    delete rateLimitStore[resourceKey];
  }
}

/**
 * Create a rate-limited function wrapper
 * @param fn Function to rate limit
 * @param resourceKey Key to identify the resource
 * @param options Rate limit options
 * @returns Rate-limited function
 */
export function createRateLimitedFunction<T extends (...args: any[]) => any>(
  fn: T,
  resourceKey: string,
  options: Partial<RateLimitOptions> = {}
): (...args: Parameters<T>) => ReturnType<T> | Promise<never> {
  return (...args: Parameters<T>): ReturnType<T> | Promise<never> => {
    if (isRateLimited(resourceKey, options)) {
      const status = getRateLimitStatus(resourceKey);
      const blockTimeRemaining = status?.blockRemaining || 0;
      
      console.warn(`Rate limit in effect for ${resourceKey}. Try again in ${Math.ceil(blockTimeRemaining / 1000)} seconds.`);
      
      return Promise.reject(
        new Error(`Rate limit exceeded. Try again in ${Math.ceil(blockTimeRemaining / 1000)} seconds.`)
      );
    }
    
    return fn(...args);
  };
}
