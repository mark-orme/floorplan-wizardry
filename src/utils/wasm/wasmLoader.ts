
/**
 * WebAssembly loader for geometry calculations
 */

/**
 * Check if WebAssembly is supported in the current browser
 * @returns Whether WebAssembly is supported
 */
export function isWasmSupported(): boolean {
  return typeof WebAssembly === 'object' && 
         typeof WebAssembly.instantiate === 'function' &&
         typeof WebAssembly.compile === 'function';
}

/**
 * Load the geometry WebAssembly module
 * @returns Promise resolving to the module exports
 */
export async function loadGeometryModule(): Promise<any> {
  if (!isWasmSupported()) {
    console.warn('WebAssembly is not supported in this browser');
    return null;
  }
  
  try {
    // Attempt to fetch and compile the WebAssembly module
    const response = await fetch('/wasm/geometry.wasm');
    const buffer = await response.arrayBuffer();
    const result = await WebAssembly.instantiate(buffer);
    
    // Return the module exports
    return result.instance.exports;
  } catch (error) {
    console.error('Failed to load WebAssembly module:', error);
    return null;
  }
}

/**
 * Create a throttled RAF (Request Animation Frame) function
 * @param fn Function to throttle
 * @returns Throttled function
 */
export function throttleRAF(fn: (...args: any[]) => void): (...args: any[]) => void {
  let rafId: number | null = null;
  let lastArgs: any[] | null = null;
  
  return (...args: any[]) => {
    lastArgs = args;
    
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          fn(...lastArgs);
        }
        rafId = null;
      });
    }
  };
}
