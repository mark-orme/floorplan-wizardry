
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
    threads: supported && typeof SharedArrayBuffer === 'function',
    simd: false, // Cannot be detected easily in JS, would require feature detection
    exceptions: false, // Cannot be detected easily in JS, would require feature detection
  };
}
