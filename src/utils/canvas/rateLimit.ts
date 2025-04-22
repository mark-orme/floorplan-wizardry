
/**
 * Utilities for rate limiting operations
 * Used for optimizing performance-sensitive canvas operations
 */

/**
 * Creates a throttled function that only invokes the provided function 
 * at most once per every `wait` milliseconds
 * 
 * @param func The function to throttle
 * @param wait The number of milliseconds to throttle invocations to
 * @param options Options object
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...funcArgs: Parameters<T>) => ReturnType<T> | undefined {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;
  const { leading = true, trailing = true } = options;
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const now = Date.now();
    if (!previous && !leading) previous = now;
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      return func.apply(this, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
    
    return undefined;
  };
}

/**
 * Creates a debounced function that delays invoking the provided function
 * until after `wait` milliseconds have elapsed since the last time it was invoked
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @param options Options object
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; maxWait?: number; trailing?: boolean } = {}
): (...funcArgs: Parameters<T>) => ReturnType<T> | undefined {
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let result: ReturnType<T> | undefined;
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime: number | null = null;
  
  const { leading = false, maxWait = 0, trailing = true } = options;
  
  function invokeFunc(time: number): ReturnType<T> | undefined {
    const args = lastArgs!;
    const thisArg = lastThis;
    
    lastArgs = lastThis = null;
    lastCallTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  
  function shouldInvoke(time: number): boolean {
    if (lastCallTime === null) return true;
    
    const timeSinceLastCall = time - lastCallTime;
    const timeExceeded = timeSinceLastCall >= wait;
    
    return timeExceeded || (maxWait > 0 && timeSinceLastCall >= maxWait);
  }
  
  function trailingEdge(time: number): ReturnType<T> | undefined {
    timerId = null;
    
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    
    lastArgs = lastThis = null;
    return result;
  }
  
  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const waitLength = wait - timeSinceLastCall;
    
    return maxWait > 0
      ? Math.min(waitLength, maxWait - timeSinceLastCall)
      : waitLength;
  }
  
  function debounced(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    lastThis = this;
    
    if (isInvoking) {
      if (timerId === null) {
        lastCallTime = time;
        
        if (leading) {
          return invokeFunc(lastCallTime);
        }
      }
      
      if (maxWait > 0) {
        timerId = setTimeout(() => trailingEdge(Date.now()), maxWait);
      }
    }
    
    if (timerId === null) {
      timerId = setTimeout(() => trailingEdge(Date.now()), remainingWait(time));
    }
    
    return result;
  }
  
  return debounced;
}
