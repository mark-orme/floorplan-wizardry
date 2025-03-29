
/**
 * Console throttling utilities
 * Prevents excessive console logging by throttling messages
 * @module grid/consoleThrottling
 */

// Track last log times by message
const lastLogTimes: Record<string, number> = {};
const DEFAULT_THROTTLE_MS = 5000;

/**
 * Log a message with throttling
 * Only logs once per throttle period for the same message
 * 
 * @param {string} message - Message to log
 * @param {any} data - Optional data to log
 * @param {number} throttleMs - Throttle period in milliseconds
 */
export const throttledLog = (
  message: string,
  data?: any,
  throttleMs: number = DEFAULT_THROTTLE_MS
): void => {
  const now = Date.now();
  const lastTime = lastLogTimes[message] || 0;
  
  if (now - lastTime > throttleMs) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
    
    lastLogTimes[message] = now;
  }
};

/**
 * Log an error with throttling
 * Only logs once per throttle period for the same error message
 * 
 * @param {string} message - Error message to log
 * @param {any} error - Optional error object to log
 * @param {number} throttleMs - Throttle period in milliseconds
 */
export const throttledError = (
  message: string,
  error?: any,
  throttleMs: number = DEFAULT_THROTTLE_MS
): void => {
  const now = Date.now();
  const lastTime = lastLogTimes[message] || 0;
  
  if (now - lastTime > throttleMs) {
    if (error) {
      console.error(message, error);
    } else {
      console.error(message);
    }
    
    lastLogTimes[message] = now;
  }
};

/**
 * Reset throttling for a specific message
 * Allows the message to be logged immediately next time
 * 
 * @param {string} message - Message to reset
 */
export const resetThrottling = (message: string): void => {
  delete lastLogTimes[message];
};

/**
 * Clear all throttling state
 * Allows all messages to be logged immediately
 */
export const clearAllThrottling = (): void => {
  Object.keys(lastLogTimes).forEach(key => {
    delete lastLogTimes[key];
  });
};
