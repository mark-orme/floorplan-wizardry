/**
 * Enhanced Rate Limiting Utilities
 * Provides more sophisticated rate limiting with adaptive throttling and persistence
 */

import { toast } from 'sonner';
import logger from '@/utils/logger';

interface RateLimitConfig {
  windowMs: number;           // Time window in milliseconds
  maxRequests: number;        // Maximum requests in the window
  blockDuration?: number;     // How long to block if limit exceeded (ms)
  incrementBy?: number;       // How much to increment the counter (default: 1)
  adaptiveFactors?: {         // Optional adaptive throttling
    consecutive: number;      // Number of consecutive violations to trigger adaptive throttling
    multiplier: number;       // How much to multiply the block duration
    maxMultiplier: number;    // Maximum multiplier
  }
}

// Store for rate limit records with persistence
class RateLimitStore {
  private records: Map<string, RateLimitRecord> = new Map();
  private storageKey = 'app_rate_limits';
  
  constructor() {
    this.loadFromStorage();
    
    // Clean up expired records periodically
    setInterval(() => this.cleanupExpiredRecords(), 60000);
  }
  
  // Get a rate limit record, creating if it doesn't exist
  get(key: string): RateLimitRecord {
    if (!this.records.has(key)) {
      this.records.set(key, new RateLimitRecord());
    }
    return this.records.get(key)!;
  }
  
  // Save all records to localStorage
  private saveToStorage(): void {
    try {
      const recordsToStore: Record<string, any> = {};
      
      this.records.forEach((record, key) => {
        if (record.isActive()) {
          recordsToStore[key] = record.serialize();
        }
      });
      
      localStorage.setItem(this.storageKey, JSON.stringify(recordsToStore));
    } catch (e) {
      logger.warn('Failed to save rate limit records to storage', e);
    }
  }
  
  // Load records from localStorage
  private loadFromStorage(): void {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (!storedData) return;
      
      const parsedData = JSON.parse(storedData);
      
      Object.entries(parsedData).forEach(([key, value]) => {
        const record = new RateLimitRecord();
        record.deserialize(value as any);
        
        if (record.isActive()) {
          this.records.set(key, record);
        }
      });
    } catch (e) {
      logger.warn('Failed to load rate limit records from storage', e);
    }
  }
  
  // Remove expired records
  private cleanupExpiredRecords(): void {
    const now = Date.now();
    let changed = false;
    
    this.records.forEach((record, key) => {
      if (!record.isActive(now)) {
        this.records.delete(key);
        changed = true;
      }
    });
    
    if (changed) {
      this.saveToStorage();
    }
  }
  
  // Save any changes
  commit(): void {
    this.saveToStorage();
  }
}

// Rate limit record class
class RateLimitRecord {
  count: number = 0;
  firstRequest: number = 0;
  lastRequest: number = 0;
  blocked: boolean = false;
  blockedUntil?: number;
  consecutiveViolations: number = 0;
  
  // Check if the record is active (not expired)
  isActive(now: number = Date.now()): boolean {
    // Keep blocked records
    if (this.blocked && this.blockedUntil && now < this.blockedUntil) {
      return true;
    }
    
    // Keep records with recent activity
    if (now - this.lastRequest < 24 * 60 * 60 * 1000) {
      return true;
    }
    
    return false;
  }
  
  // Serialize for storage
  serialize(): any {
    return {
      count: this.count,
      firstRequest: this.firstRequest,
      lastRequest: this.lastRequest,
      blocked: this.blocked,
      blockedUntil: this.blockedUntil,
      consecutiveViolations: this.consecutiveViolations
    };
  }
  
  // Deserialize from storage
  deserialize(data: any): void {
    this.count = data.count || 0;
    this.firstRequest = data.firstRequest || 0;
    this.lastRequest = data.lastRequest || 0;
    this.blocked = data.blocked || false;
    this.blockedUntil = data.blockedUntil;
    this.consecutiveViolations = data.consecutiveViolations || 0;
  }
}

// Initialize the store
const rateLimitStore = new RateLimitStore();

/**
 * Check if an action is rate limited
 * @param key Unique identifier for the rate limited action
 * @param options Rate limiting options
 * @returns Whether the action is currently rate limited
 */
export function isRateLimited(key: string, options: RateLimitConfig): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  // Check if currently blocked
  if (record.blocked && record.blockedUntil && now < record.blockedUntil) {
    record.lastRequest = now;
    rateLimitStore.commit();
    return true;
  }
  
  // Initialize record if this is a new window
  if (record.firstRequest === 0 || now - record.firstRequest > options.windowMs) {
    record.count = 1;
    record.firstRequest = now;
    record.lastRequest = now;
    record.blocked = false;
    delete record.blockedUntil;
    
    // If this is a brand new request (not just a new window), reset consecutive violations
    if (now - record.lastRequest > options.windowMs * 2) {
      record.consecutiveViolations = 0;
    }
    
    rateLimitStore.commit();
    return false;
  }
  
  // Increment count and check against limit
  record.count += (options.incrementBy || 1);
  record.lastRequest = now;
  
  // Block if limit exceeded
  if (record.count > options.maxRequests) {
    record.blocked = true;
    
    // Calculate block duration with adaptive throttling if configured
    let blockDuration = options.blockDuration || options.windowMs;
    
    if (options.adaptiveFactors && record.consecutiveViolations >= options.adaptiveFactors.consecutive) {
      const multiplier = Math.min(
        options.adaptiveFactors.maxMultiplier,
        options.adaptiveFactors.multiplier * (record.consecutiveViolations - options.adaptiveFactors.consecutive + 1)
      );
      blockDuration = blockDuration * multiplier;
      
      // Log adaptive rate limiting
      logger.warn(`Adaptive rate limit applied: ${key} blocked for ${blockDuration}ms (multiplier: ${multiplier})`);
    }
    
    record.blockedUntil = now + blockDuration;
    record.consecutiveViolations++;
    
    rateLimitStore.commit();
    return true;
  }
  
  rateLimitStore.commit();
  return false;
}

/**
 * Get information about current rate limit status
 * @param key Unique identifier for the rate limited action
 * @param options Rate limiting options to check against
 * @returns Rate limit status or null if not found
 */
export function getRateLimitStatus(key: string, options: RateLimitConfig): {
  remaining: number;
  reset: number;
  blocked: boolean;
  nextWindow: number;
} | null {
  const record = rateLimitStore.get(key);
  const now = Date.now();
  
  // If blocked, return block info
  if (record.blocked && record.blockedUntil && now < record.blockedUntil) {
    return {
      remaining: 0,
      reset: record.blockedUntil,
      blocked: true,
      nextWindow: record.blockedUntil
    };
  }
  
  // If in an active window, calculate remaining
  if (record.firstRequest > 0 && now - record.firstRequest <= options.windowMs) {
    return {
      remaining: Math.max(0, options.maxRequests - record.count),
      reset: record.firstRequest + options.windowMs,
      blocked: false,
      nextWindow: record.firstRequest + options.windowMs
    };
  }
  
  // No active window
  return {
    remaining: options.maxRequests,
    reset: now,
    blocked: false,
    nextWindow: now + options.windowMs
  };
}

/**
 * Reset rate limiting for a specific key
 * @param key Key to reset
 */
export function resetRateLimit(key: string): void {
  const record = rateLimitStore.get(key);
  
  record.count = 0;
  record.firstRequest = 0;
  record.blocked = false;
  delete record.blockedUntil;
  record.consecutiveViolations = 0;
  
  rateLimitStore.commit();
  logger.info(`Rate limit reset for: ${key}`);
}

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
  options: RateLimitConfig,
  onLimited?: (status: ReturnType<typeof getRateLimitStatus>) => void
): (...args: Parameters<T>) => Promise<ReturnType<T> | undefined> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
    if (isRateLimited(key, options)) {
      const status = getRateLimitStatus(key, options);
      
      if (onLimited) {
        onLimited(status);
      } else {
        // Default handling - show toast with retry information
        const resetDate = new Date(status?.reset || Date.now());
        const timeString = resetDate.toLocaleTimeString();
        toast.error(`Rate limit exceeded. Please try again after ${timeString}.`);
      }
      
      return undefined;
    }
    
    return fn(...args);
  };
}

/**
 * Rate limiting options for different action types
 */
export const rateLimitOptions = {
  authentication: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 login attempts
    blockDuration: 30 * 60 * 1000, // 30 minute block
    adaptiveFactors: {
      consecutive: 3,
      multiplier: 2,
      maxMultiplier: 8
    }
  },
  apiRequests: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute (1 per second average)
    blockDuration: 2 * 60 * 1000, // 2 minute block
  },
  formSubmissions: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 submissions per minute
    blockDuration: 5 * 60 * 1000, // 5 minute block
  },
  fileUploads: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 20, // 20 uploads per 10 minutes
    blockDuration: 15 * 60 * 1000, // 15 minute block
  }
};
