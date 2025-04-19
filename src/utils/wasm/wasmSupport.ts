
/**
 * WASM support detection
 * @module utils/wasm/wasmSupport
 */

/**
 * Check if WebAssembly is supported by the current browser
 * @returns True if WebAssembly is supported
 */
export function isWasmSupported(): boolean {
  try {
    // Check if WebAssembly object exists
    if (typeof WebAssembly === 'object' 
        && typeof WebAssembly.instantiate === 'function'
        && typeof WebAssembly.compile === 'function') {
      
      // Test a minimal module
      const module = new WebAssembly.Module(new Uint8Array([
        0x00, 0x61, 0x73, 0x6d, // WASM_BINARY_MAGIC
        0x01, 0x00, 0x00, 0x00  // WASM_BINARY_VERSION
      ]));
      
      // Test if we can instantiate
      if (module instanceof WebAssembly.Module) {
        const instance = new WebAssembly.Instance(module);
        return instance instanceof WebAssembly.Instance;
      }
    }
  } catch (e) {
    return false;
  }
  
  return false;
}

/**
 * Check if WebAssembly threads are supported
 * @returns True if WebAssembly threads are supported
 */
export function supportsWasmThreads(): boolean {
  try {
    // Check for SharedArrayBuffer support (required for threads)
    if (typeof SharedArrayBuffer !== 'function') {
      return false;
    }
    
    // Check for Atomics support
    if (typeof Atomics !== 'object') {
      return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if WebAssembly SIMD is supported
 * @returns True if WebAssembly SIMD is supported
 */
export function supportsWasmSIMD(): boolean {
  // SIMD detection requires actually trying to instantiate a SIMD module
  // We'll return a conservative estimate based on browser support
  const ua = navigator.userAgent;
  
  // Chrome 91+, Edge 91+, Firefox 89+, Safari 16.4+
  if (
    (/Chrome\/([0-9]+)/.test(ua) && parseInt(RegExp.$1) >= 91) ||
    (/Firefox\/([0-9]+)/.test(ua) && parseInt(RegExp.$1) >= 89) ||
    (/Safari\/([0-9]+)/.test(ua) && parseInt(RegExp.$1) >= 16)
  ) {
    return true;
  }
  
  return false;
}

/**
 * Get details about WebAssembly support
 * @returns Object with support status and capabilities
 */
export function getWasmSupportDetails(): {
  supported: boolean;
  streaming: boolean;
  threads: boolean;
  simd: boolean;
  exceptions: boolean;
} {
  const supported = isWasmSupported();
  
  return {
    supported,
    streaming: supported && typeof WebAssembly.instantiateStreaming === 'function',
    threads: supported && supportsWasmThreads(),
    simd: supported && supportsWasmSIMD(),
    exceptions: false, // Currently not widely supported
  };
}
