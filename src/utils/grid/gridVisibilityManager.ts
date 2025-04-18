
/**
 * Grid visibility manager
 * Ensures grid is visible and properly maintained
 * @module utils/grid/gridVisibilityManager
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createBasicEmergencyGrid } from '@/utils/gridCreationUtils';
import logger from '@/utils/logger';

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
    // First, check if grid already exists
    const existingGridObjects = canvas.getObjects().filter(obj => 
      (obj as any).isGrid === true || (obj as any).objectType === 'grid'
    );
    
    // If grid objects found, ensure they're visible
    if (existingGridObjects.length > 0) {
      let visibilityFixed = false;
      
      existingGridObjects.forEach(obj => {
        if (!obj.visible) {
          obj.set('visible', true);
          visibilityFixed = true;
        }
      });
      
      if (visibilityFixed) {
        canvas.requestRenderAll();
        
        return {
          success: true,
          action: 'fixed',
          gridObjects: existingGridObjects
        };
      }
      
      return {
        success: true,
        action: 'none',
        gridObjects: existingGridObjects
      };
    }
    
    // No grid found, create a new one
    const newGridObjects = createBasicEmergencyGrid(canvas);
    
    return {
      success: newGridObjects.length > 0,
      action: 'created',
      gridObjects: newGridObjects
    };
  } catch (error) {
    logger.error("Error ensuring grid presence:", error);
    
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
export function setupGridMonitoring(
  canvas: FabricCanvas,
  intervalMs: number = 5000
): () => void {
  if (!canvas) return () => {};
  
  const intervalId = setInterval(() => {
    ensureGridIsPresent(canvas);
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
  
  const result = ensureGridIsPresent(canvas);
  return result.success;
}

/**
 * Add iOS-specific grid enhancements
 * @param canvas - Fabric canvas
 */
export function enhanceGridForIOS(canvas: FabricCanvas): void {
  if (!canvas || !canvas.wrapperEl) return;
  
  // Add iOS-specific classes
  canvas.wrapperEl.classList.add('ios-canvas');
  
  // Force another render for iOS
  setTimeout(() => {
    if (canvas) {
      canvas.requestRenderAll();
    }
  }, 500);
}
