
/**
 * Fabric.js Helper Utilities
 * Provides safer interaction with Fabric.js functionality
 * @module utils/canvas/fabricHelpers
 */
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';
import { captureError } from '@/utils/sentryUtils';

/**
 * Create a FabricCanvas instance with enhanced error handling
 * specifically addressing the 'elements.lower.el' error
 * 
 * @param canvasEl Canvas DOM element or selector
 * @param options Canvas options object
 * @returns FabricCanvas instance or null if failed
 */
export function createSafeFabricCanvas(
  canvasEl: HTMLCanvasElement | string,
  options: Record<string, any> = {}
): FabricCanvas | null {
  try {
    // If we were given a selector, try to find the element
    let canvasElement: HTMLCanvasElement | null = null;
    
    if (typeof canvasEl === 'string') {
      canvasElement = document.getElementById(canvasEl) as HTMLCanvasElement;
      if (!canvasElement) {
        logger.error(`Canvas element with ID "${canvasEl}" not found`);
        return null;
      }
    } else {
      canvasElement = canvasEl;
    }
    
    // Ensure proper dimensions
    if (!canvasElement.width || !canvasElement.height) {
      canvasElement.width = options.width || 800;
      canvasElement.height = options.height || 600;
    }
    
    // Make sure canvas is visible in the DOM
    if (!canvasElement.style.display || canvasElement.style.display === 'none') {
      canvasElement.style.display = 'block';
    }
    
    // Force a reflow to ensure canvas is properly initialized
    canvasElement.getBoundingClientRect();
    
    // Special handling to prevent the 'elements.lower.el' error
    // This error occurs when fabric.js can't properly set up its internal elements
    try {
      // Create the Fabric.js canvas instance with our enhanced options
      const canvas = new FabricCanvas(canvasElement, {
        renderOnAddRemove: false, // Improve performance
        enableRetinaScaling: false, // Prevent issues on high-DPI displays
        ...options
      });
      
      // Verify the canvas was properly initialized by checking for critical properties
      if (!canvas.elements?.lower?.el) {
        throw new Error('Fabric canvas initialization failed: lower.el is undefined');
      }
      
      return canvas;
    } catch (fabricError) {
      if (String(fabricError).includes('elements.lower.el')) {
        // Attempt recovery from the specific lower.el error
        return attemptLowerElErrorRecovery(canvasElement, options);
      }
      
      throw fabricError;
    }
  } catch (error) {
    // Log the error with detailed diagnostic information
    captureError(error, 'safe-fabric-canvas-creation-failed', {
      level: 'error',
      tags: {
        component: 'fabricHelpers',
        operation: 'createSafeFabricCanvas'
      },
      extra: {
        options,
        canvasInfo: typeof canvasEl === 'string' 
          ? { selector: canvasEl } 
          : { 
              width: canvasEl.width, 
              height: canvasEl.height,
              id: canvasEl.id,
              isConnected: canvasEl.isConnected
            }
      }
    });
    
    return null;
  }
}

/**
 * Attempt to recover from the 'elements.lower.el' error
 * This is a known issue with Fabric.js that can sometimes be fixed
 * 
 * @param canvasElement Canvas DOM element
 * @param options Canvas options
 * @returns FabricCanvas instance or null if recovery failed
 */
function attemptLowerElErrorRecovery(
  canvasElement: HTMLCanvasElement,
  options: Record<string, any>
): FabricCanvas | null {
  logger.info("Attempting recovery from 'elements.lower.el' error");
  
  try {
    // Create a new canvas element to replace the problematic one
    const recoveryCanvas = document.createElement('canvas');
    recoveryCanvas.width = canvasElement.width;
    recoveryCanvas.height = canvasElement.height;
    recoveryCanvas.id = `${canvasElement.id || 'canvas'}-recovery`;
    recoveryCanvas.className = canvasElement.className;
    recoveryCanvas.style.cssText = canvasElement.style.cssText;
    
    // Ensure the canvas is properly sized
    recoveryCanvas.style.width = `${canvasElement.width}px`;
    recoveryCanvas.style.height = `${canvasElement.height}px`;
    
    // Replace the original canvas with our recovery canvas
    if (canvasElement.parentNode) {
      canvasElement.parentNode.replaceChild(recoveryCanvas, canvasElement);
    } else {
      // If no parent, try to add to body as a last resort
      document.body.appendChild(recoveryCanvas);
    }
    
    // Create a new Fabric canvas with the recovery canvas
    const canvas = new FabricCanvas(recoveryCanvas, options);
    
    // Check if recovery was successful
    if (canvas.elements?.lower?.el) {
      logger.info("Successfully recovered from 'elements.lower.el' error");
      return canvas;
    }
    
    throw new Error("Recovery from 'elements.lower.el' error failed");
  } catch (recoveryError) {
    captureError(recoveryError, 'lower-el-error-recovery-failed', {
      level: 'error',
      tags: {
        component: 'fabricHelpers',
        operation: 'attemptLowerElErrorRecovery'
      }
    });
    
    return null;
  }
}

/**
 * Safely dispose of a Fabric.js canvas instance
 * Ensures proper cleanup to prevent memory leaks and initialization issues
 * 
 * @param canvas Fabric.js canvas instance to dispose
 */
export function safeDisposeFabricCanvas(canvas: FabricCanvas | null): void {
  if (!canvas) return;
  
  try {
    // Clear all objects first
    canvas.clear();
    
    // Remove all event listeners
    canvas.off();
    
    // Dispose the canvas
    canvas.dispose();
    
    logger.info("Fabric canvas safely disposed");
  } catch (error) {
    captureError(error, 'fabric-canvas-dispose-error', {
      level: 'warning',
      tags: {
        component: 'fabricHelpers',
        operation: 'safeDisposeFabricCanvas'
      }
    });
  }
}

/**
 * Check if the Fabric.js library is properly loaded
 * @returns Success status and error details if failed
 */
export function checkFabricLibrary(): { success: boolean; error?: string } {
  try {
    if (typeof (window as any).fabric === 'undefined') {
      return { success: false, error: 'Fabric.js not loaded' };
    }
    
    const fabric = (window as any).fabric;
    
    if (!fabric.Canvas || typeof fabric.Canvas !== 'function') {
      return { success: false, error: 'fabric.Canvas is not available' };
    }
    
    if (!fabric.Object || typeof fabric.Object !== 'function') {
      return { success: false, error: 'fabric.Object is not available' };
    }
    
    if (!fabric.util || typeof fabric.util.getElement !== 'function') {
      return { success: false, error: 'fabric.util.getElement is not available' };
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
