
/**
 * WebAssembly Module Loader
 * Provides utilities for loading and using WebAssembly modules
 */

interface GeometryModule {
  calculate: (x: number, y: number) => number;
}

interface PDFModule {
  generate: (x: number, y: number) => number;
}

const moduleCache: Record<string, WebAssembly.Instance> = {};

/**
 * Load a WebAssembly module
 * @param url URL of the WebAssembly module
 * @returns Promise resolving to the instantiated module
 */
export async function loadWasmModule(url: string): Promise<WebAssembly.Instance> {
  // Check if module is already cached
  if (moduleCache[url]) {
    return moduleCache[url];
  }
  
  try {
    // Fetch and compile the module
    const response = await fetch(url);
    const bytes = await response.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(bytes);
    
    // Cache the module
    moduleCache[url] = instance;
    
    return instance;
  } catch (error) {
    console.error(`Error loading WebAssembly module ${url}:`, error);
    throw error;
  }
}

/**
 * Load the geometry module for optimized calculations
 * @returns Promise resolving to the geometry module
 */
export async function loadGeometryModule(): Promise<GeometryModule> {
  const instance = await loadWasmModule('/wasm/geometry.wasm');
  return instance.exports as unknown as GeometryModule;
}

/**
 * Load the PDF generation module
 * @returns Promise resolving to the PDF module
 */
export async function loadPDFModule(): Promise<PDFModule> {
  const instance = await loadWasmModule('/wasm/pdf.wasm');
  return instance.exports as unknown as PDFModule;
}

/**
 * Check if WebAssembly is supported in the current browser
 * @returns True if WebAssembly is supported
 */
export function isWasmSupported(): boolean {
  return typeof WebAssembly === 'object' && 
         typeof WebAssembly.instantiate === 'function';
}
