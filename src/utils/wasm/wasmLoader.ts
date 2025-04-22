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

/**
 * Geometry calculation function using WebAssembly
 * @param points Array of points to process
 * @param operation The geometry operation to perform
 * @returns Result of the geometry calculation
 */
export async function geometryCalculation(
  points: Array<{x: number, y: number}>, 
  operation: 'area' | 'length' | 'smooth' | 'bezier'
): Promise<number | Array<{x: number, y: number}>> {
  // Load the WASM module
  const module = await loadGeometryModule();
  
  if (!module) {
    console.warn('WebAssembly module not available, falling back to JS implementation');
    
    // Fallback implementations when WASM is not available
    switch (operation) {
      case 'area':
        return calculateAreaJS(points);
      case 'length':
        return calculateLengthJS(points);
      case 'smooth':
        return smoothPointsJS(points);
      case 'bezier':
        return createBezierCurveJS(points);
      default:
        throw new Error(`Unknown geometry operation: ${operation}`);
    }
  }
  
  // Convert points to flat array for WASM (x1, y1, x2, y2, ...)
  const flatPoints = new Float64Array(points.length * 2);
  points.forEach((point, i) => {
    flatPoints[i * 2] = point.x;
    flatPoints[i * 2 + 1] = point.y;
  });
  
  // Create memory in the WASM module for input data
  const inputPtr = module.allocateMemory(flatPoints.byteLength);
  
  // Create a view of the module's memory
  const memory = new Uint8Array(module.memory.buffer);
  
  // Copy the input data to the module's memory
  new Uint8Array(memory.buffer, inputPtr, flatPoints.byteLength)
    .set(new Uint8Array(flatPoints.buffer));
  
  // Call the appropriate function based on the operation
  let resultPtr: number;
  let resultSize: number;
  
  switch (operation) {
    case 'area':
      return module.calculateArea(inputPtr, points.length);
    
    case 'length':
      return module.calculateLength(inputPtr, points.length);
    
    case 'smooth':
      resultPtr = module.smoothPoints(inputPtr, points.length);
      resultSize = module.getResultSize();
      break;
    
    case 'bezier':
      resultPtr = module.createBezierCurve(inputPtr, points.length);
      resultSize = module.getResultSize();
      break;
    
    default:
      throw new Error(`Unknown geometry operation: ${operation}`);
  }
  
  // For operations that return points
  if (operation === 'smooth' || operation === 'bezier') {
    // Read back the result data
    const resultData = new Float64Array(
      memory.buffer.slice(resultPtr, resultPtr + resultSize * 16)
    );
    
    // Convert flat array back to points
    const resultPoints = [];
    for (let i = 0; i < resultData.length / 2; i++) {
      resultPoints.push({
        x: resultData[i * 2],
        y: resultData[i * 2 + 1]
      });
    }
    
    // Free the allocated memory
    module.freeMemory(inputPtr);
    module.freeMemory(resultPtr);
    
    return resultPoints;
  }
  
  // Free the allocated memory
  module.freeMemory(inputPtr);
  
  return 0; // This should never be reached
}

/**
 * Fallback JavaScript implementation for calculating polygon area
 */
function calculateAreaJS(points: Array<{x: number, y: number}>): number {
  if (points.length < 3) return 0;
  
  let area = 0;
  const n = points.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area / 2);
}

/**
 * Fallback JavaScript implementation for calculating path length
 */
function calculateLengthJS(points: Array<{x: number, y: number}>): number {
  if (points.length < 2) return 0;
  
  let length = 0;
  
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i-1].x;
    const dy = points[i].y - points[i-1].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  
  return length;
}

/**
 * Fallback JavaScript implementation for smoothing points
 */
function smoothPointsJS(points: Array<{x: number, y: number}>): Array<{x: number, y: number}> {
  if (points.length <= 2) return [...points];
  
  const smoothedPoints = [];
  
  // Keep the first point
  smoothedPoints.push({ ...points[0] });
  
  // Smooth the middle points
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    smoothedPoints.push({
      x: (prev.x + curr.x * 4 + next.x) / 6,
      y: (prev.y + curr.y * 4 + next.y) / 6
    });
  }
  
  // Keep the last point
  smoothedPoints.push({ ...points[points.length - 1] });
  
  return smoothedPoints;
}

/**
 * Fallback JavaScript implementation for creating Bezier curve
 */
function createBezierCurveJS(points: Array<{x: number, y: number}>): Array<{x: number, y: number}> {
  if (points.length < 3) return [...points];
  
  const curvePoints = [];
  const numSegments = Math.max(Math.floor(points.length / 3) * 10, 10);
  
  // Generate Bezier curve points
  for (let i = 0; i < points.length - 2; i += 2) {
    const p0 = points[i];
    const p1 = points[Math.min(i + 1, points.length - 1)];
    const p2 = points[Math.min(i + 2, points.length - 1)];
    
    for (let t = 0; t <= numSegments; t++) {
      const t1 = t / numSegments;
      
      // Quadratic Bezier formula
      const x = (1 - t1) * (1 - t1) * p0.x + 2 * (1 - t1) * t1 * p1.x + t1 * t1 * p2.x;
      const y = (1 - t1) * (1 - t1) * p0.y + 2 * (1 - t1) * t1 * p1.y + t1 * t1 * p2.y;
      
      curvePoints.push({ x, y });
    }
  }
  
  return curvePoints;
}
