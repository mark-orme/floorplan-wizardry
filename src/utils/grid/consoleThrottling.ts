
/**
 * Console throttling utilities
 * Prevents excessive console output from grid operations
 * @module grid/consoleThrottling
 */

// Track seen messages and their timestamps
const seenMessages: Map<string, number> = new Map();
const MESSAGE_THROTTLE_TIME = 5000; // 5 seconds between identical messages

/**
 * Throttled console log
 * Only logs messages if they haven't been seen recently
 * 
 * @param {string} message - Message to log
 * @param {any[]} args - Additional args to log
 */
export function throttledLog(message: string, ...args: any[]): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  const now = Date.now();
  const lastTime = seenMessages.get(message) || 0;
  
  // Only log if we haven't seen this message recently
  if (now - lastTime > MESSAGE_THROTTLE_TIME) {
    console.log(message, ...args);
    seenMessages.set(message, now);
    
    // Clean up old messages to prevent memory leaks
    if (seenMessages.size > 100) {
      // Remove the oldest entries
      const oldestEntries = [...seenMessages.entries()]
        .sort((a, b) => a[1] - b[1])
        .slice(0, 50);
        
      oldestEntries.forEach(([key]) => seenMessages.delete(key));
    }
  }
}

/**
 * Throttled error logging
 * Always logs errors, but prevents duplicates
 * 
 * @param {string} message - Error message
 * @param {any[]} args - Additional args to log
 */
export function throttledError(message: string, ...args: any[]): void {
  const now = Date.now();
  const lastTime = seenMessages.get(`error:${message}`) || 0;
  
  // For errors, use a shorter throttle time
  if (now - lastTime > 1000) {
    console.error(message, ...args);
    seenMessages.set(`error:${message}`, now);
  }
}

/**
 * Clear the throttled message cache
 */
export function clearMessageCache(): void {
  seenMessages.clear();
}
