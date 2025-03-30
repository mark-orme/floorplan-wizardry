
/**
 * Console throttling utility
 * Prevents excessive console logging
 * @module grid/consoleThrottling
 */

// Map to store last log timestamps
const lastLogTimes: Record<string, number> = {};

/**
 * Throttled console log
 * Only logs messages at most once per interval
 * 
 * @param {string} message - The message to log
 * @param {number} interval - Throttle interval in ms (default: 1000)
 */
export function throttledLog(message: string, interval = 1000): void {
  const now = Date.now();
  const lastTime = lastLogTimes[message] || 0;
  
  if (now - lastTime >= interval) {
    console.log(message);
    lastLogTimes[message] = now;
  }
}

/**
 * Throttled console warn
 * Only logs warnings at most once per interval
 * 
 * @param {string} message - The warning message to log
 * @param {number} interval - Throttle interval in ms (default: 1000)
 */
export function throttledWarn(message: string, interval = 1000): void {
  const now = Date.now();
  const lastTime = lastLogTimes[`warn:${message}`] || 0;
  
  if (now - lastTime >= interval) {
    console.warn(message);
    lastLogTimes[`warn:${message}`] = now;
  }
}

/**
 * Throttled console error
 * Only logs errors at most once per interval
 * 
 * @param {string} message - The error message to log
 * @param {number} interval - Throttle interval in ms (default: 1000)
 */
export function throttledError(message: string, interval = 1000): void {
  const now = Date.now();
  const lastTime = lastLogTimes[`error:${message}`] || 0;
  
  if (now - lastTime >= interval) {
    console.error(message);
    lastLogTimes[`error:${message}`] = now;
  }
}
