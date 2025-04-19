/**
 * WASM module exports
 * @module utils/wasm
 */

import { isWasmSupported, getWasmSupportDetails } from './wasmSupport';
import { calculateAreaJs } from '../geometry';
import { Point } from '@/types/core/Geometry';
import logger from '@/utils/logger';

// Import our WebAssembly modules
import geometryWasmUrl from '@/wasm/geometry.wasm?url';
import pdfWasmUrl from '@/wasm/pdf.wasm?url';

/**
 * Check if WebAssembly is available
 * @returns True if WebAssembly is supported
 */
export const supportsWasm = isWasmSupported;

/**
 * Status of WASM module loading
 */
export const wasmStatus = {
  geometryModuleLoaded: false,
  pdfModuleLoaded: false,
  error: null as Error | null,
};

// Module caches
let geometryModule: any = null;
let pdfModule: any = null;

/**
 * Load a WASM module
 * @param url URL of the WASM module
 * @param imports Import object for the module
 * @returns Promise resolving to the instantiated module
 */
async function loadWasmModule(url: string, imports: any = {}): Promise<any> {
  try {
    // Use instantiateStreaming if available for better performance
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      const response = await fetch(url);
      const { instance } = await WebAssembly.instantiateStreaming(response, { env: imports });
      return instance.exports;
    } else {
      // Fallback to ArrayBuffer approach
      const response = await fetch(url);
      const bytes = await response.arrayBuffer();
      const { instance } = await WebAssembly.instantiate(bytes, { env: imports });
      return instance.exports;
    }
  } catch (error) {
    logger.error(`Failed to load WASM module from ${url}:`, error);
    throw error;
  }
}

/**
 * Initialize geometry WASM module
 */
async function initGeometryModule(): Promise<void> {
  if (geometryModule) return;
  
  try {
    // Define environment imports for the geometry module
    const imports = {
      memory: new WebAssembly.Memory({ initial: 10, maximum: 100 }),
      log: (value: number) => console.log(value),
    };
    
    geometryModule = await loadWasmModule(geometryWasmUrl, imports);
    wasmStatus.geometryModuleLoaded = true;
    logger.info('Geometry WASM module loaded successfully');
  } catch (error) {
    wasmStatus.error = error as Error;
    logger.error('Failed to initialize geometry WASM module:', error);
    throw error;
  }
}

/**
 * Initialize PDF WASM module
 */
async function initPdfModule(): Promise<void> {
  if (pdfModule) return;
  
  try {
    // Define environment imports for the PDF module
    const imports = {
      memory: new WebAssembly.Memory({ initial: 20, maximum: 200 }),
      log: (value: number) => console.log(value),
    };
    
    pdfModule = await loadWasmModule(pdfWasmUrl, imports);
    wasmStatus.pdfModuleLoaded = true;
    logger.info('PDF WASM module loaded successfully');
  } catch (error) {
    wasmStatus.error = error as Error;
    logger.error('Failed to initialize PDF WASM module:', error);
    throw error;
  }
}

/**
 * Convert JS points to WASM memory
 * @param points Array of points
 * @param module WASM module
 * @returns Pointer to the points array in WASM memory
 */
function pointsToWasm(points: Point[], module: any): number {
  const memory = module.memory.buffer;
  const pointsPtr = module.allocatePoints(points.length);
  const pointsArray = new Float64Array(memory, pointsPtr, points.length * 2);
  
  for (let i = 0; i < points.length; i++) {
    pointsArray[i * 2] = points[i].x;
    pointsArray[i * 2 + 1] = points[i].y;
  }
  
  return pointsPtr;
}

/**
 * Calculate area of a polygon using WASM when available
 * @param points Array of points defining the polygon
 * @returns Area of the polygon
 */
export const calculateArea = async (points: Point[]): Promise<number> => {
  // For empty or invalid polygons
  if (!points || points.length < 3) {
    return 0;
  }
  
  // If WASM is not supported or there's an error, use JS fallback
  if (!isWasmSupported() || wasmStatus.error) {
    return calculateAreaJs(points);
  }
  
  try {
    // Initialize geometry module if not already loaded
    if (!wasmStatus.geometryModuleLoaded) {
      await initGeometryModule();
    }
    
    // If module failed to load, use JS fallback
    if (!geometryModule) {
      return calculateAreaJs(points);
    }
    
    // Convert points to WASM memory
    const pointsPtr = pointsToWasm(points, geometryModule);
    
    // Call WASM function to calculate area
    const area = geometryModule.calculatePolygonArea(pointsPtr, points.length);
    
    // Free memory in WASM
    geometryModule.freePoints(pointsPtr);
    
    return area;
  } catch (error) {
    logger.error('Error in WASM calculateArea, falling back to JS:', error);
    return calculateAreaJs(points);
  }
};

/**
 * Simplify a polygon path using Douglas-Peucker algorithm
 * @param points Array of points defining the polygon
 * @param tolerance Distance tolerance for simplification
 * @returns Simplified array of points
 */
export const simplifyPath = async (points: Point[], tolerance: number = 1.0): Promise<Point[]> => {
  // For small paths, just return the original
  if (points.length <= 2) {
    return [...points];
  }
  
  // If WASM is not supported or there's an error, use JS fallback
  if (!isWasmSupported() || wasmStatus.error) {
    // Use a simpler JS-based simplification
    return simplifyPathJs(points, tolerance);
  }
  
  try {
    // Initialize geometry module if not already loaded
    if (!wasmStatus.geometryModuleLoaded) {
      await initGeometryModule();
    }
    
    // If module failed to load, use JS fallback
    if (!geometryModule) {
      return simplifyPathJs(points, tolerance);
    }
    
    // Convert points to WASM memory
    const pointsPtr = pointsToWasm(points, geometryModule);
    
    // Call WASM function to simplify path
    const resultPtr = geometryModule.simplifyPolygon(pointsPtr, points.length, tolerance);
    const resultSize = geometryModule.getResultSize();
    
    // Read results from WASM memory
    const memory = geometryModule.memory.buffer;
    const resultArray = new Float64Array(memory, resultPtr, resultSize * 2);
    
    // Convert back to JS points
    const result: Point[] = [];
    for (let i = 0; i < resultSize; i++) {
      result.push({
        x: resultArray[i * 2],
        y: resultArray[i * 2 + 1]
      });
    }
    
    // Free memory in WASM
    geometryModule.freePoints(pointsPtr);
    geometryModule.freeResult(resultPtr);
    
    return result;
  } catch (error) {
    logger.error('Error in WASM simplifyPath, falling back to JS:', error);
    return simplifyPathJs(points, tolerance);
  }
};

/**
 * JavaScript fallback for path simplification
 * Implements a simple version of the Douglas-Peucker algorithm
 */
function simplifyPathJs(points: Point[], tolerance: number): Point[] {
  if (points.length <= 2) return [...points];
  
  // Find the point with the maximum distance
  const findFurthestPoint = (start: Point, end: Point, points: Point[]): { index: number, distance: number } => {
    let maxDistance = 0;
    let index = 0;
    
    for (let i = 1; i < points.length - 1; i++) {
      const distance = perpendicularDistance(points[i], start, end);
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }
    
    return { index, distance: maxDistance };
  };
  
  // Calculate perpendicular distance from a point to a line
  const perpendicularDistance = (point: Point, lineStart: Point, lineEnd: Point): number => {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    
    // If the line is just a point, return the distance to that point
    if (dx === 0 && dy === 0) {
      const xDiff = point.x - lineStart.x;
      const yDiff = point.y - lineStart.y;
      return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }
    
    // Calculate perpendicular distance
    const lineLengthSquared = dx * dx + dy * dy;
    const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSquared;
    
    if (t < 0) {
      // Point is beyond the lineStart end of the line
      return Math.sqrt(
        (point.x - lineStart.x) * (point.x - lineStart.x) +
        (point.y - lineStart.y) * (point.y - lineStart.y)
      );
    }
    
    if (t > 1) {
      // Point is beyond the lineEnd end of the line
      return Math.sqrt(
        (point.x - lineEnd.x) * (point.x - lineEnd.x) +
        (point.y - lineEnd.y) * (point.y - lineEnd.y)
      );
    }
    
    // Point is between the line endpoints
    const projectX = lineStart.x + t * dx;
    const projectY = lineStart.y + t * dy;
    
    return Math.sqrt(
      (point.x - projectX) * (point.x - projectX) +
      (point.y - projectY) * (point.y - projectY)
    );
  };
  
  // Recursive Douglas-Peucker algorithm
  const douglasPeucker = (points: Point[], tolerance: number): Point[] => {
    if (points.length <= 2) return points;
    
    const { index, distance } = findFurthestPoint(points[0], points[points.length - 1], points);
    
    if (distance > tolerance) {
      // Recursive case: split and simplify
      const firstHalf = douglasPeucker(points.slice(0, index + 1), tolerance);
      const secondHalf = douglasPeucker(points.slice(index), tolerance);
      
      // Combine results (avoiding duplicating the split point)
      return [...firstHalf.slice(0, -1), ...secondHalf];
    } else {
      // Base case: all points are within tolerance, keep only endpoints
      return [points[0], points[points.length - 1]];
    }
  };
  
  return douglasPeucker(points, tolerance);
}

/**
 * Generate a PDF from canvas objects
 * @param objects Array of objects to include in the PDF
 * @param width Width of the PDF in points (72 dpi)
 * @param height Height of the PDF in points (72 dpi)
 * @param title Title of the PDF
 * @returns ArrayBuffer containing the PDF data
 */
export const generatePdf = async (
  objects: any[],
  width: number,
  height: number,
  title: string = 'Canvas Export'
): Promise<ArrayBuffer> => {
  // If WASM is not supported or there's an error, throw an error
  if (!isWasmSupported() || wasmStatus.error) {
    throw new Error('PDF generation requires WebAssembly support');
  }
  
  try {
    // Initialize PDF module if not already loaded
    if (!wasmStatus.pdfModuleLoaded) {
      await initPdfModule();
    }
    
    // If module failed to load, throw an error
    if (!pdfModule) {
      throw new Error('Failed to load PDF WASM module');
    }
    
    // Prepare PDF document properties
    const docPtr = pdfModule.createDocument(width, height);
    const titlePtr = pdfModule.allocateString(title);
    pdfModule.setDocumentTitle(docPtr, titlePtr);
    
    // Add objects to the PDF
    for (const obj of objects) {
      if (obj.type === 'path' || obj.type === 'polygon') {
        // Convert path points to WASM format
        const points = obj.points || obj.path;
        if (points && points.length > 0) {
          const pointsPtr = pointsToWasm(points, pdfModule);
          pdfModule.addPath(docPtr, pointsPtr, points.length, obj.fill || '#000000', obj.stroke || '#000000', obj.strokeWidth || 1);
          pdfModule.freePoints(pointsPtr);
        }
      } else if (obj.type === 'rect') {
        pdfModule.addRectangle(
          docPtr,
          obj.left || 0,
          obj.top || 0,
          obj.width || 10,
          obj.height || 10,
          obj.fill || '#000000',
          obj.stroke || '#000000',
          obj.strokeWidth || 1
        );
      } else if (obj.type === 'circle') {
        pdfModule.addCircle(
          docPtr,
          obj.left || 0,
          obj.top || 0,
          obj.radius || 5,
          obj.fill || '#000000',
          obj.stroke || '#000000',
          obj.strokeWidth || 1
        );
      } else if (obj.type === 'text') {
        const textPtr = pdfModule.allocateString(obj.text || '');
        pdfModule.addText(
          docPtr,
          textPtr,
          obj.left || 0,
          obj.top || 0,
          obj.fontSize || 12,
          obj.fill || '#000000'
        );
        pdfModule.freeString(textPtr);
      }
    }
    
    // Generate the PDF data
    const pdfDataPtr = pdfModule.generatePdf(docPtr);
    const pdfSize = pdfModule.getPdfSize();
    
    // Copy the PDF data to a JavaScript ArrayBuffer
    const memory = pdfModule.memory.buffer;
    const pdfData = new Uint8Array(memory, pdfDataPtr, pdfSize);
    const result = new ArrayBuffer(pdfSize);
    new Uint8Array(result).set(pdfData);
    
    // Clean up resources
    pdfModule.freePdf(pdfDataPtr);
    pdfModule.freeDocument(docPtr);
    pdfModule.freeString(titlePtr);
    
    return result;
  } catch (error) {
    logger.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error}`);
  }
};

/**
 * Initialize WASM modules
 * @returns Promise that resolves when initialization is complete
 */
export const initWasmModules = async (): Promise<void> => {
  if (!isWasmSupported()) {
    wasmStatus.error = new Error('WebAssembly not supported in this browser');
    logger.warn('WebAssembly not supported in this browser');
    return;
  }
  
  try {
    // Initialize both modules
    await Promise.all([
      initGeometryModule().catch(error => {
        logger.error('Failed to initialize geometry module:', error);
      }),
      initPdfModule().catch(error => {
        logger.error('Failed to initialize PDF module:', error);
      })
    ]);
    
    logger.info('WASM modules initialized successfully');
  } catch (error) {
    wasmStatus.error = error as Error;
    logger.error('Failed to initialize WASM modules:', error);
  }
};

/**
 * Get support status and feature details
 */
export const getWasmFeatures = (): {
  supported: boolean;
  geometryAvailable: boolean;
  pdfAvailable: boolean;
  features: ReturnType<typeof getWasmSupportDetails>;
} => {
  return {
    supported: isWasmSupported(),
    geometryAvailable: wasmStatus.geometryModuleLoaded,
    pdfAvailable: wasmStatus.pdfModuleLoaded,
    features: getWasmSupportDetails()
  };
};
