
/**
 * Grid visibility helper utilities
 * Provides additional visibility management functions 
 * @module utils/grid/gridVisibilityHelper
 */
import { Canvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';
import { isGridObject } from './gridRenderers';

// Interface for visibility toggle options
interface VisibilityOptions {
  fadeIn?: boolean;
  duration?: number;
  onComplete?: () => void;
}

/**
 * Toggle grid visibility with optional animation
 * @param canvas Canvas to manipulate
 * @param gridObjects Grid objects to toggle
 * @param visible Target visibility state
 * @param options Animation options
 */
export function toggleGridVisibility(
  canvas: Canvas,
  gridObjects: FabricObject[],
  visible: boolean,
  options: VisibilityOptions = {}
): void {
  if (!canvas || !gridObjects.length) {
    return;
  }
  
  const { fadeIn = false, duration = 300, onComplete } = options;
  
  try {
    if (fadeIn && visible) {
      // Animate fade-in
      gridObjects.forEach(obj => {
        obj.set({
          visible: true,
          opacity: 0
        });
        
        const targetOpacity = (obj as { originalOpacity?: number }).originalOpacity || 0.5;
        
        // Simple animation using setTimeout
        let startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(1, elapsed / duration);
          
          obj.set('opacity', progress * targetOpacity);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            obj.set('opacity', targetOpacity);
          }
          canvas.requestRenderAll();
        };
        
        requestAnimationFrame(animate);
      });
    } else {
      // Immediate visibility change
      gridObjects.forEach(obj => {
        obj.set('visible', visible);
      });
      canvas.requestRenderAll();
    }
    
    if (onComplete) {
      setTimeout(onComplete, duration);
    }
    
    logger.debug(`Grid visibility toggled to ${visible}`);
  } catch (error) {
    logger.error('Error toggling grid visibility:', error instanceof Error ? error.message : String(error));
  }
}

/**
 * Check if grid is currently visible
 * @param canvas Canvas to check
 * @returns Grid visibility status
 */
export function isGridVisible(canvas: Canvas): boolean {
  if (!canvas) return false;
  
  try {
    const gridObjects = canvas.getObjects().filter(obj => isGridObject(obj));
    
    if (gridObjects.length === 0) {
      return false;
    }
    
    // Grid is considered visible if at least one grid object is visible
    return gridObjects.some(obj => obj.visible);
  } catch (error) {
    logger.error('Error checking grid visibility:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

/**
 * Store current grid visibility state
 * @param canvas Canvas to check
 * @returns Current grid visibility or null if no grid exists
 */
export function captureGridVisibilityState(canvas: Canvas): boolean | null {
  if (!canvas) return null;
  
  try {
    const gridObjects = canvas.getObjects().filter(obj => isGridObject(obj));
    
    if (gridObjects.length === 0) {
      return null;
    }
    
    // Determine overall grid visibility
    // Grid is considered visible if majority of objects are visible
    const visibleCount = gridObjects.filter(obj => obj.visible).length;
    return visibleCount > gridObjects.length / 2;
  } catch (error) {
    logger.error('Error capturing grid visibility:', error instanceof Error ? error.message : String(error));
    return null;
  }
}
