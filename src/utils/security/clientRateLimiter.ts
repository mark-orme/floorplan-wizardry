
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
  delete rateLimitStates[identifier];
}

/**
 * Create a rate-limited function wrapper
 * @param fn Function to rate limit
 * @param config Rate limit configuration
 * @param blockDurationMs Optional duration to block if rate limit exceeded
 * @returns Rate-limited function
 */
export function createRateLimitedFunction<T extends (...args: any[]) => any>(
  fn: T,
  config: RateLimitConfig,
  blockDurationMs?: number
): (...args: Parameters<T>) => Promise<ReturnType<T> | void> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | void> => {
    const check = checkRateLimit(config, blockDurationMs);
    
    if (check.isLimited) {
      if (check.blockedFor) {
        console.warn(`Rate limit exceeded for ${config.identifier}. Blocked for ${check.blockedFor}ms.`);
      } else {
        console.warn(`Rate limit exceeded for ${config.identifier}. Try again later.`);
      }
      
      return;
    }
    
    return fn(...args);
  };
}

// Export common rate limit configurations
export const rateLimitConfigs = {
  api: {
    light: { maxRequests: 20, timeWindowMs: 1000, identifier: 'api-light' },
    normal: { maxRequests: 100, timeWindowMs: 60000, identifier: 'api-normal' },
    strict: { maxRequests: 20, timeWindowMs: 60000, identifier: 'api-strict' }
  },
  auth: {
    login: { maxRequests: 5, timeWindowMs: 60000, identifier: 'auth-login' },
    register: { maxRequests: 3, timeWindowMs: 300000, identifier: 'auth-register' },
    passwordReset: { maxRequests: 2, timeWindowMs: 600000, identifier: 'auth-password-reset' }
  },
  ui: {
    search: { maxRequests: 10, timeWindowMs: 10000, identifier: 'ui-search' },
    button: { maxRequests: 30, timeWindowMs: 10000, identifier: 'ui-button' }
  }
};
