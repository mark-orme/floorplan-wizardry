
/**
 * Client-side rate limiting utilities
 * Helps prevent API abuse by throttling requests
 */

interface RateLimitConfig {
  maxRequests: number;  // Maximum number of requests allowed
  timeWindowMs: number; // Time window in milliseconds
  identifier: string;   // Unique identifier for this limit (e.g., 'api-calls', 'login-attempts')
}

interface RateLimitState {
  count: number;
  windowStart: number;
  isBlocked: boolean;
  blockUntil?: number;
}

// Store rate limiting state
const rateLimitStates: Record<string, RateLimitState> = {};

/**
 * Check if a request should be rate limited
 * @param config Rate limit configuration
 * @param blockDurationMs Optional duration to block if rate limit exceeded
 * @returns Object with isLimited status and optional information
 */
export function checkRateLimit(
  config: RateLimitConfig,
  blockDurationMs?: number
): { isLimited: boolean; remaining: number; resetIn: number; blockedFor?: number } {
  const now = Date.now();
  const state = rateLimitStates[config.identifier] || {
    count: 0,
    windowStart: now,
    isBlocked: false
  };
  
  // If currently blocked, check if block has expired
  if (state.isBlocked && state.blockUntil && now < state.blockUntil) {
    return { 
      isLimited: true, 
      remaining: 0, 
      resetIn: 0,
      blockedFor: state.blockUntil - now
    };
  }
  
  // If block expired or not blocked, and window expired, reset
  if ((state.isBlocked && state.blockUntil && now >= state.blockUntil) || 
      now - state.windowStart > config.timeWindowMs) {
    state.count = 1;
    state.windowStart = now;
    state.isBlocked = false;
    delete state.blockUntil;
    
    rateLimitStates[config.identifier] = state;
    
    return { 
      isLimited: false, 
      remaining: config.maxRequests - 1,
      resetIn: config.timeWindowMs
    };
  }
  
  // Increment counter and check limit
  state.count++;
  
  if (state.count > config.maxRequests) {
    state.isBlocked = true;
    
    if (blockDurationMs) {
      state.blockUntil = now + blockDurationMs;
    }
    
    rateLimitStates[config.identifier] = state;
    
    return { 
      isLimited: true, 
      remaining: 0, 
      resetIn: config.timeWindowMs - (now - state.windowStart),
      blockedFor: blockDurationMs
    };
  }
  
  rateLimitStates[config.identifier] = state;
  
  return { 
    isLimited: false, 
    remaining: config.maxRequests - state.count,
    resetIn: config.timeWindowMs - (now - state.windowStart)
  };
}

/**
 * Reset rate limit state for a specific identifier
 * @param identifier Rate limit identifier to reset
 */
export function resetRateLimit(identifier: string): void {
  if (rateLimitStates[identifier]) {
    delete rateLimitStates[identifier];
  }
}

/**
 * Create a rate-limited function wrapper
 * @param fn Function to rate limit
 * @param identifier Rate limit identifier
 * @param config Rate limit configuration
 * @returns Rate-limited function
 */
export function createRateLimitedFunction<T extends (...args: any[]) => any>(
  fn: T,
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): (...args: Parameters<T>) => ReturnType<T> | Promise<never> {
  const defaultConfig: RateLimitConfig = {
    maxRequests: 5,
    timeWindowMs: 1000,
    identifier
  };
  
  const finalConfig = { ...defaultConfig, ...config };
  
  return (...args: Parameters<T>): ReturnType<T> | Promise<never> => {
    const limitResult = checkRateLimit(finalConfig);
    
    if (limitResult.isLimited) {
      const resetTime = Math.ceil(limitResult.resetIn / 1000);
      console.warn(`Rate limit in effect for ${identifier}. Try again in ${resetTime} seconds.`);
      
      return Promise.reject(
        new Error(`Rate limit exceeded. Try again in ${resetTime} seconds.`)
      );
    }
    
    return fn(...args);
  };
}
