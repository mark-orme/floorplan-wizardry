/**
 * Safe Canvas Initialization Utilities
 * Provides enhanced safety mechanisms for canvas initialization
 * @module utils/canvas/safeCanvasInitialization
 */
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { captureError } from '@/utils/sentryUtils';
import logger from '@/utils/logger';

// Track initialization state to prevent multiple attempts
const canvasInitializationState = {
  isInitializing: false,
  initializeCount: 0,
  lastInitTime: 0,
  lastError: null as Error | null,
  canvasRegistry: new Map<string, boolean>(), // Track canvas element IDs
  fabricInstances: [] as FabricCanvas[],
  isBlocked: false,
  maxInitAttempts: 3,
};

/**
 * Safe canvas initialization check
 * Wraps Fabric.js canvas initialization with comprehensive error checking
 * 
 * @param canvasElement Canvas HTML element
 * @param options Fabric.js canvas options
 * @returns Fabric.js canvas instance or null if initialization failed
 */
export function safeCanvasInitialization(
  canvasElement: HTMLCanvasElement | null,
  options: Record<string, any> = {}
): FabricCanvas | null {
  // Skip if initialization is blocked due to too many attempts
  if (canvasInitializationState.isBlocked) {
    logger.warn("Canvas initialization blocked due to too many failed attempts");
    toast.error("Canvas initialization is blocked. Please refresh the page.");
    return null;
  }

  // Check if we're already initializing
  if (canvasInitializationState.isInitializing) {
    logger.warn("Canvas initialization already in progress, skipping");
    return null;
  }

  // Increment attempt count
  canvasInitializationState.initializeCount++;
  canvasInitializationState.lastInitTime = Date.now();
  
  // Block if we've exceeded maximum attempts
  if (canvasInitializationState.initializeCount > canvasInitializationState.maxInitAttempts) {
    logger.error(`Too many canvas initialization attempts (${canvasInitializationState.initializeCount}). Blocking further attempts.`);
    toast.error("Too many canvas initialization attempts. Please refresh the page.");
    canvasInitializationState.isBlocked = true;
    return null;
  }

  // Check if canvas element is available
  if (!canvasElement) {
    const error = new Error("Canvas element is null or undefined");
    canvasInitializationState.lastError = error;
    
    captureError(error, 'canvas-element-missing', {
      level: 'error',
      tags: {
        component: 'safeCanvasInitialization',
        operation: 'canvas-check',
        attempt: String(canvasInitializationState.initializeCount)
      },
      extra: {
        canvasCount: document.querySelectorAll('canvas').length,
        documentReady: document.readyState
      }
    });
    
    return null;
  }
  
  // Set initialization flag
  canvasInitializationState.isInitializing = true;
  
  try {
    // Force specific dimensions on the canvas element to prevent sizing issues
    // This is critical for the 'elements.lower.el' error
    if (!canvasElement.width || canvasElement.width < 1) {
      canvasElement.width = options.width || 800;
    }
    
    if (!canvasElement.height || canvasElement.height < 1) {
      canvasElement.height = options.height || 600;
    }
    
    // Make sure the canvas is visible in the DOM
    canvasElement.style.display = 'block';
    
    // Pre-check if element is connected to DOM
    if (!canvasElement.isConnected) {
      throw new Error("Canvas element is not connected to the DOM");
    }
    
    // Log detailed information about the canvas element
    logger.info("Canvas element details before initialization", {
      id: canvasElement.id,
      width: canvasElement.width,
      height: canvasElement.height,
      isConnected: canvasElement.isConnected,
      parent: canvasElement.parentElement ? 
        `${canvasElement.parentElement.tagName}${canvasElement.parentElement.id ? '#' + canvasElement.parentElement.id : ''}` : 
        'no-parent'
    });
    
    // Create Fabric.js canvas with additional safety
    const canvas = new FabricCanvas(canvasElement, {
      ...options,
      width: canvasElement.width,
      height: canvasElement.height
    });
    
    // Verify canvas has necessary properties after initialization
    // This specifically addresses the 'elements.lower.el' error
    if (!canvas.elements?.lower?.el) {
      throw new Error("Fabric.js canvas was created but lower element is missing");
    }
    
    // Register this canvas instance
    canvasInitializationState.fabricInstances.push(canvas);
    
    // Add ID to registry if it has one
    if (canvasElement.id) {
      canvasInitializationState.canvasRegistry.set(canvasElement.id, true);
    }
    
    // Reset the initialization flag
    canvasInitializationState.isInitializing = false;
    
    return canvas;
  } catch (error) {
    const typedError = error instanceof Error ? error : new Error(String(error));
    canvasInitializationState.lastError = typedError;
    
    // Log specific information about the error
    logger.error("Error during safe canvas initialization", {
      error: typedError.message,
      stack: typedError.stack,
      attempt: canvasInitializationState.initializeCount
    });
    
    captureError(typedError, 'safe-canvas-init-error', {
      level: 'error',
      tags: {
        component: 'safeCanvasInitialization',
        operation: 'canvas-init',
        attempt: String(canvasInitializationState.initializeCount)
      },
      extra: {
        canvasElement: {
          id: canvasElement?.id,
          width: canvasElement?.width,
          height: canvasElement?.height,
          isConnected: canvasElement?.isConnected
        },
        options,
        initState: {
          count: canvasInitializationState.initializeCount,
          time: canvasInitializationState.lastInitTime
        }
      }
    });
    
    // Reset the initialization flag
    canvasInitializationState.isInitializing = false;
    
    return null;
  }
}

/**
 * Reset canvas initialization state
 * Used when component unmounts or to force a clean slate
 */
export function resetInitializationState(): void {
  // Clean up any existing instances
  canvasInitializationState.fabricInstances.forEach(canvas => {
    try {
      canvas.dispose();
    } catch (e) {
      // Ignore disposal errors
    }
  });
  
  // Reset state
  canvasInitializationState.isInitializing = false;
  canvasInitializationState.fabricInstances = [];
  canvasInitializationState.canvasRegistry.clear();
  
  // Keep some information for diagnostic purposes
  // but reset the block if requested
  if (canvasInitializationState.isBlocked) {
    logger.info("Resetting canvas initialization block");
  }
  
  canvasInitializationState.isBlocked = false;
}

/**
 * Validate if a canvas was initialized correctly
 * @param canvas Fabric.js canvas instance to validate
 * @returns True if canvas is valid
 */
export function validateCanvasInitialization(canvas: FabricCanvas | null): boolean {
  if (!canvas) return false;
  
  try {
    // Check critical properties
    if (!canvas.elements?.lower?.el) return false;
    if (!canvas.elements?.upper?.el) return false;
    
    // Check if dimensions are valid
    if (!canvas.width || canvas.width <= 0) return false;
    if (!canvas.height || canvas.height <= 0) return false;
    
    // Check if canvas can perform basic operations
    const testRect = new (window as any).fabric.Rect({
      width: 10,
      height: 10,
      left: 10,
      top: 10,
      fill: 'red'
    });
    
    canvas.add(testRect);
    canvas.remove(testRect);
    
    return true;
  } catch (error) {
    logger.error("Canvas validation failed", error);
    return false;
  }
}

/**
 * Handle canvas initialization failure with enhanced error reporting
 * @param errorMessage Error message
 */
export function handleInitializationFailure(errorMessage: string): void {
  const lowerElementError = errorMessage.includes('elements.lower.el');
  
  captureError(
    new Error(`Canvas initialization failure: ${errorMessage}`),
    lowerElementError ? 'canvas-lower-element-error' : 'canvas-init-failure',
    {
      level: 'error',
      tags: {
        component: 'canvasInitialization',
        operation: 'initialization',
        attempt: String(canvasInitializationState.initializeCount),
        lowerElementError: String(lowerElementError)
      },
      extra: {
        initState: {
          count: canvasInitializationState.initializeCount,
          time: canvasInitializationState.lastInitTime,
          isBlocked: canvasInitializationState.isBlocked
        },
        documentReady: document.readyState,
        canvasElements: document.querySelectorAll('canvas').length,
        lowerCanvasElements: document.querySelectorAll('.lower-canvas').length,
        upperCanvasElements: document.querySelectorAll('.upper-canvas').length
      }
    }
  );
  
  // Prevent excessive error notifications
  if (canvasInitializationState.initializeCount <= 2) {
    toast.error(
      lowerElementError 
        ? 'Canvas failed to initialize (lower element issue). Please refresh the page.' 
        : 'Canvas initialization failed. Please refresh the page.'
    );
  }
}

/**
 * Prepare the canvas element for initialization
 * Ensures the canvas is in a good state before Fabric.js tries to initialize it
 */
export function prepareCanvasForInitialization(): void {
  // Find and clean up any orphaned canvas elements
  const orphanedLowerCanvases = document.querySelectorAll('.lower-canvas:not([data-fabric-owned="true"])');
  const orphanedUpperCanvases = document.querySelectorAll('.upper-canvas:not([data-fabric-owned="true"])');
  
  orphanedLowerCanvases.forEach(canvas => {
    logger.info("Removing orphaned lower-canvas element");
    canvas.remove();
  });
  
  orphanedUpperCanvases.forEach(canvas => {
    logger.info("Removing orphaned upper-canvas element");
    canvas.remove();
  });
  
  // Ensure no other code is also initializing canvases at the same time
  if (canvasInitializationState.isInitializing) {
    logger.warn("Another canvas initialization is in progress");
  }
}

/**
 * Get diagnostic information about canvas initialization state
 * @returns Diagnostic information object
 */
export function getCanvasInitializationDiagnostics(): Record<string, any> {
  return {
    ...canvasInitializationState,
    fabricInstances: canvasInitializationState.fabricInstances.length,
    registeredCanvasIds: Array.from(canvasInitializationState.canvasRegistry.keys()),
    lastErrorMessage: canvasInitializationState.lastError?.message,
    lastErrorStack: canvasInitializationState.lastError?.stack,
    canvasElements: {
      total: document.querySelectorAll('canvas').length,
      lowerCanvas: document.querySelectorAll('.lower-canvas').length,
      upperCanvas: document.querySelectorAll('.upper-canvas').length,
      canvasIds: Array.from(document.querySelectorAll('canvas')).map(c => c.id || 'no-id')
    }
  };
}
