
/**
 * WebAssembly support detection
 * @module utils/wasm/wasmSupport
 */

/**
 * Check if WebAssembly is supported in the current environment
 * @returns True if WebAssembly is supported
 */
export function isWasmSupported(): boolean {
  return (
    typeof WebAssembly === 'object' &&
    typeof WebAssembly.instantiate === 'function' &&
    typeof WebAssembly.compile === 'function'
  );
}

/**
 * Get detailed information about WebAssembly support
 * @returns Object with feature support details
 */
export function getWasmSupportDetails(): Record<string, boolean> {
  if (!isWasmSupported()) {
    return {
      supported: false
    };
  }
  
  return {
    supported: true,
    streaming: typeof WebAssembly.instantiateStreaming === 'function',
    simd: detectSimdSupport(),
    threads: detectThreadsSupport(),
    reference_types: detectReferenceTypesSupport(),
    bulk_memory: detectBulkMemorySupport()
  };
}

/**
 * Detect SIMD support
 * @returns True if SIMD is supported
 */
function detectSimdSupport(): boolean {
  try {
    // SIMD feature detection is complex, this is a simplified check
    return WebAssembly.validate(new Uint8Array([
      0x00, 0x61, 0x73, 0x6d, // magic bytes
      0x01, 0x00, 0x00, 0x00, // version
      0x01, 0x05, 0x01, 0x60, 0x00, 0x01, 0x7b, // type section (simd v128 return)
      0x03, 0x02, 0x01, 0x00, // func section
      0x0a, 0x06, 0x01, 0x04, 0x00, 0xfd, 0x0f, 0x0b // code section with SIMD instruction
    ]));
  } catch (e) {
    return false;
  }
}

/**
 * Detect threads support
 * @returns True if threads are supported
 */
function detectThreadsSupport(): boolean {
  try {
    // Check for SharedArrayBuffer which is needed for threads
    return typeof SharedArrayBuffer === 'function';
  } catch (e) {
    return false;
  }
}

/**
 * Detect reference types support
 * @returns True if reference types are supported
 */
function detectReferenceTypesSupport(): boolean {
  try {
    // Simple check for reference types (not comprehensive)
    return WebAssembly.validate(new Uint8Array([
      0x00, 0x61, 0x73, 0x6d, // magic bytes
      0x01, 0x00, 0x00, 0x00, // version
      0x01, 0x04, 0x01, 0x60, 0x00, 0x00, // type section
      0x03, 0x02, 0x01, 0x00, // func section
      0x0a, 0x04, 0x01, 0x02, 0x00, 0x0b // code section with reference instruction
    ]));
  } catch (e) {
    return false;
  }
}

/**
 * Detect bulk memory operations support
 * @returns True if bulk memory operations are supported
 */
function detectBulkMemorySupport(): boolean {
  try {
    // Simple check for bulk memory operations (not comprehensive)
    return WebAssembly.validate(new Uint8Array([
      0x00, 0x61, 0x73, 0x6d, // magic bytes
      0x01, 0x00, 0x00, 0x00, // version
      0x01, 0x04, 0x01, 0x60, 0x00, 0x00, // type section
      0x03, 0x02, 0x01, 0x00, // func section
      0x0a, 0x04, 0x01, 0x02, 0x00, 0x0b, // code section
      0x0c, 0x01, 0x00 // data count section (indicator of bulk memory)
    ]));
  } catch (e) {
    return false;
  }
}
