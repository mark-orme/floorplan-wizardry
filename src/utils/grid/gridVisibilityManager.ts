/**
 * Grid visibility manager
 * Ensures grid is visible and properly maintained
 * @module utils/grid/gridVisibilityManager
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createBasicEmergencyGrid } from '@/utils/gridCreationUtils';
import logger from "@/utils/logger";
import * as Sentry from '@sentry/react';
import { captureMessage, captureError } from '@/utils/sentry';

/**
 * Result of the ensureGridIsPresent operation
 */
interface GridPresenceResult {
  success: boolean;
  action: 'none' | 'created' | 'fixed';
  gridObjects: FabricObject[];
}

/**
 * Ensures grid is present and visible on canvas
 * @param canvas - Fabric canvas
 * @returns Grid presence result
 */
export function ensureGridIsPresent(canvas: FabricCanvas): GridPresenceResult {
  if (!canvas) {
    return {
      success: false,
      action: 'none',
      gridObjects: []
    };
  }
  
  try {
    // Start diagnostic span
    const transaction = Sentry.startTransaction({
      name: 'grid.ensure_presence',
      op: 'grid'
    });
    
    // First, check if grid already exists
    const existingGridObjects = canvas.getObjects().filter(obj => 
      (obj as any).isGrid === true || (obj as any).objectType === 'grid'
    );
    
    transaction.setData('existingGridCount', existingGridObjects.length);
    
    // If grid objects found, ensure they're visible
    if (existingGridObjects.length > 0) {
      let visibilityFixed = false;
      
      existingGridObjects.forEach(obj => {
        if (!obj.visible) {
          obj.set('visible', true);
          visibilityFixed = true;
        }
        
        // Ensure full opacity
        if (obj.opacity !== 1) {
          obj.set('opacity', 1);
          visibilityFixed = true;
        }
      });
      
      if (visibilityFixed) {
        canvas.requestRenderAll();
        
        // Log fix to Sentry
        captureMessage("Grid visibility fixed", "grid-visibility-fixed", {
          tags: {
            objectCount: String(existingGridObjects.length)
          },
          extra: {
            fixedObjects: existingGridObjects.map(obj => ({
              id: obj.id,
              type: obj.type
            }))
          }
        });
        
        transaction.setStatus('ok');
        transaction.finish();
        
        return {
          success: true,
          action: 'fixed',
          gridObjects: existingGridObjects
        };
      }
      
      transaction.setStatus('ok');
      transaction.finish();
      
      return {
        success: true,
        action: 'none',
        gridObjects: existingGridObjects
      };
    }
    
    // No grid found, create a new one
    logger.info("No grid found - creating emergency grid");
    
    const newGridObjects = createBasicEmergencyGrid(canvas);
    
    // Log grid creation
    captureMessage("Emergency grid created", "grid-created", {
      tags: {
        objectCount: String(newGridObjects.length),
        canvasWidth: String(canvas.width),
        canvasHeight: String(canvas.height)
      }
    });
    
    transaction.setData('createdGridCount', newGridObjects.length);
    transaction.setStatus('ok');
    transaction.finish();
    
    return {
      success: newGridObjects.length > 0,
      action: 'created',
      gridObjects: newGridObjects
    };
  } catch (error) {
    logger.error("Error ensuring grid presence:", error);
    captureError(error, "grid-presence-error");
    
    return {
      success: false,
      action: 'none',
      gridObjects: []
    };
  }
}

/**
 * Set up grid monitoring to periodically check and fix grid visibility
 * @param canvas - Fabric canvas
 * @param intervalMs - Monitoring interval in milliseconds
 * @returns Cleanup function
 */
export function setupGridVisibilityCheck(
  canvas: FabricCanvas,
  intervalMs: number = 5000
): () => void {
  if (!canvas) return () => {};
  
  // Track total fixes applied
  let fixesApplied = 0;
  
  // Perform initial check immediately
  setTimeout(() => {
    const result = ensureGridIsPresent(canvas);
    
    if (result.action !== 'none') {
      fixesApplied++;
      
      // Log first fix to Sentry
      captureMessage(`Initial grid visibility check: ${result.action}`, "grid-initial-fix", {
        tags: {
          action: result.action,
          objectCount: String(result.gridObjects.length)
        }
      });
    }
  }, 100);
  
  const intervalId = setInterval(() => {
    try {
      const result = ensureGridIsPresent(canvas);
      
      if (result.action !== 'none') {
        fixesApplied++;
        
        // Log grid fixes at specific thresholds
        if (fixesApplied === 1 || fixesApplied === 5 || fixesApplied % 10 === 0) {
          captureMessage(
            `Grid needed ${result.action} (fix #${fixesApplied})`,
            "grid-periodic-fix",
            {
              level: fixesApplied >= 10 ? 'warning' : 'info',
              tags: {
                action: result.action,
                fixCount: String(fixesApplied),
                objectCount: String(result.gridObjects.length)
              }
            }
          );
        }
      }
    } catch (error) {
      captureError(error, "grid-monitoring-error");
    }
  }, intervalMs);
  
  return () => clearInterval(intervalId);
}

/**
 * Force grid visibility
 * @param canvas - Fabric canvas
 * @returns Whether operation succeeded
 */
export function forceGridVisibility(canvas: FabricCanvas): boolean {
  if (!canvas) return false;
  
  try {
    // Start a Sentry transaction for this operation
    const transaction = Sentry.startTransaction({
      name: 'grid.force_visibility',
      op: 'grid'
    });
    
    const result = ensureGridIsPresent(canvas);
    
    // Set rich data on transaction for analysis
    transaction.setData('result', {
      success: result.success,
      action: result.action,
      objectCount: result.gridObjects.length
    });
    
    // Force an extra render
    canvas.requestRenderAll();
    
    // On iOS, force another render after a short delay
    const isIOS = /iphone|ipad|ipod|mac/.test(navigator.userAgent.toLowerCase());
    if (isIOS) {
      setTimeout(() => {
        if (canvas) {
          canvas.requestRenderAll();
        }
      }, 100);
    }
    
    // Log aggressive visibility enforcement
    if (result.gridObjects.length > 0) {
      result.gridObjects.forEach(obj => {
        obj.set({
          visible: true,
          opacity: 1
        });
      });
      canvas.requestRenderAll();
    }
    
    transaction.setStatus(result.success ? 'ok' : 'error');
    transaction.finish();
    
    return result.success;
  } catch (error) {
    captureError(error, "force-grid-visibility-error");
    return false;
  }
}

/**
 * Add iOS-specific grid enhancements
 * @param canvas - Fabric canvas
 */
export function enhanceGridForIOS(canvas: FabricCanvas): void {
  if (!canvas || !canvas.wrapperEl) return;
  
  try {
    // Add iOS-specific classes
    canvas.wrapperEl.classList.add('ios-canvas');
    document.body.classList.add('ios-device');
    
    // Find all grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).isGrid === true || (obj as any).objectType === 'grid'
    );
    
    // Apply iOS-specific enhancements to grid objects
    gridObjects.forEach(obj => {
      if (obj.type === 'line') {
        // Enhance line visibility for iOS
        obj.set({
          strokeWidth: 1.5,
          stroke: 'rgba(0, 0, 0, 0.6)',
          opacity: 1,
          visible: true
        });
      }
    });
    
    // Log enhancement application
    captureMessage("iOS grid enhancements applied", "ios-grid-enhanced", {
      tags: {
        objectsEnhanced: String(gridObjects.length),
        canvasWidth: String(canvas.width),
        canvasHeight: String(canvas.height)
      },
      extra: {
        cssClasses: canvas.wrapperEl.className,
        deviceInfo: {
          userAgent: navigator.userAgent,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          pixelRatio: window.devicePixelRatio || 1
        }
      }
    });
    
    // Force another render for iOS
    setTimeout(() => {
      if (canvas) {
        canvas.requestRenderAll();
      }
    }, 500);
  } catch (error) {
    captureError(error, "ios-grid-enhancement-error");
  }
}
