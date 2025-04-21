
/**
 * WASM module exports
 * @module utils/wasm
 */

import { isWasmSupported, getWasmSupportDetails } from './wasmSupport';
import { calculateAreaJs } from '../geometry';
import logger from '@/utils/logger';

// WASM modules URLs
const geometryWasmUrl = '/wasm/geometry.wasm';
const pdfWasmUrl = '/wasm/pdf.wasm';

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
  error: null as Error | null
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
async function loadWasmModule(url: string, imports = {}): Promise<any> {
  try {
    // Use instantiateStreaming if available for better performance
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      const response = await fetch(url);
      const { instance } = await WebAssembly.instantiateStreaming(response, {
        env: imports
      });
      return instance.exports;
    } else {
      // Fallback to ArrayBuffer approach
      const response = await fetch(url);
      const bytes = await response.arrayBuffer();
      const { instance } = await WebAssembly.instantiate(bytes, {
        env: imports
      });
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
async function initGeometryModule() {
  if (geometryModule) return;
  
  try {
    // Define environment imports for the geometry module
    const imports = {
      memory: new WebAssembly.Memory({
        initial: 10,
        maximum: 100
      }),
      log: (value: any) => console.log(value)
    };
    
    geometryModule = await loadWasmModule(geometryWasmUrl, imports);
    wasmStatus.geometryModuleLoaded = true;
    logger.info('Geometry WASM module loaded successfully');
  } catch (error) {
    if (error instanceof Error) {
      wasmStatus.error = error;
    } else {
      wasmStatus.error = new Error('Unknown error initializing geometry module');
    }
    logger.error('Failed to initialize geometry WASM module:', error);
    throw error;
  }
}

/**
 * Initialize PDF WASM module
 */
async function initPdfModule() {
  if (pdfModule) return;
  
  try {
    // Define environment imports for the PDF module
    const imports = {
      memory: new WebAssembly.Memory({
        initial: 20,
        maximum: 200
      }),
      log: (value: any) => console.log(value)
    };
    
    pdfModule = await loadWasmModule(pdfWasmUrl, imports);
    wasmStatus.pdfModuleLoaded = true;
    logger.info('PDF WASM module loaded successfully');
  } catch (error) {
    if (error instanceof Error) {
      wasmStatus.error = error;
    } else {
      wasmStatus.error = new Error('Unknown error initializing PDF module');
    }
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
function pointsToWasm(points: any[], module: any): number {
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
export const calculateArea = async (points: any[]): Promise<number> => {
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
  title = 'Canvas Export'
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
          pdfModule.addPath(
            docPtr,
            pointsPtr,
            points.length,
            obj.fill || '#000000',
            obj.stroke || '#000000',
            obj.strokeWidth || 1
          );
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
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`);
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
      initGeometryModule().catch((error) => {
        logger.error('Failed to initialize geometry module:', error);
      }),
      initPdfModule().catch((error) => {
        logger.error('Failed to initialize PDF module:', error);
      })
    ]);
    
    logger.info('WASM modules initialized successfully');
  } catch (error) {
    wasmStatus.error = error instanceof Error ? error : new Error('Unknown error initializing WASM modules');
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
  features: Record<string, boolean>;
} => {
  return {
    supported: isWasmSupported(),
    geometryAvailable: wasmStatus.geometryModuleLoaded,
    pdfAvailable: wasmStatus.pdfModuleLoaded,
    features: getWasmSupportDetails()
  };
};
