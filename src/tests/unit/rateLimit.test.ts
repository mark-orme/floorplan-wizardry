
/**
 * Rate Limiting Tests
 * Tests for debounce and throttle functions
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { debounce, throttle } from '@/utils/canvas/rateLimit';

describe('Rate Limiting', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  describe('debounce', () => {
    it('should delay function execution until after wait time', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      // Call the debounced function
      debouncedFn();
      
      // Function should not be called immediately
      expect(mockFn).not.toHaveBeenCalled();
      
      // Advance timer by 50ms (less than wait time)
      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();
      
      // Advance timer to reach wait time
      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
    
    it('should reset wait time on subsequent calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      // Call the debounced function
      debouncedFn();
      
      // Advance timer by 50ms
      vi.advanceTimersByTime(50);
      
      // Call again, which should reset the timer
      debouncedFn();
      
      // Advance another 50ms (100ms total, but timer was reset)
      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();
      
      // Advance the remaining 50ms to complete the wait time
      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('throttle', () => {
    it('should limit function execution rate', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);
      
      // Call the throttled function multiple times in quick succession
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1); // First call executes immediately
      
      throttledFn();
      throttledFn();
      
      // Additional calls within the limit time should not execute
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Advance time to exceed the limit
      vi.advanceTimersByTime(100);
      
      // Next call after the limit should execute
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
    
    it('should execute delayed calls after wait time', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);
      
      // First call executes immediately
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // These calls are within the limit, so they're queued
      throttledFn();
      throttledFn();
      
      // Advance past the limit time
      vi.advanceTimersByTime(100);
      
      // The last queued call should execute after the time limit
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});
