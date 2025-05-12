import { useCallback, useEffect, useRef } from 'react';
import { Canvas } from 'fabric';

interface UseVirtualizationEngineProps {
  canvasRef: React.MutableRefObject<Canvas | null>;
  // Add other props as needed
}

/**
 * Hook for optimizing canvas rendering with virtualization
 */
export const useVirtualizationEngine = ({ canvasRef }: UseVirtualizationEngineProps) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [viewportBounds, setViewportBounds] = useState<{
    left: number;
    top: number;
    right: number;
    bottom: number;
  } | null>(null);
  
  const visibleObjectsRef = useRef<Set<any>>(new Set());
  const offscreenObjectsRef = useRef<Set<any>>(new Set());
  
  /**
   * Check if an object is within the viewport
   */
  const isObjectInViewport = useCallback((obj: any, bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  }): boolean => {
    if (!obj) return false;
    
    // Get object bounds
    const objBounds = obj.getBoundingRect ? obj.getBoundingRect() : null;
    if (!objBounds) return true; // If can't get bounds, consider it visible
    
    // Object is visible if any part of it intersects with the viewport
    return !(
      objBounds.left > bounds.right ||
      objBounds.left + objBounds.width < bounds.left ||
      objBounds.top > bounds.bottom ||
      objBounds.top + objBounds.height < bounds.top
    );
  }, []);
  
  /**
   * Update the viewport bounds based on the current canvas transformations
   */
  const updateViewportBounds = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
    const zoom = canvas.getZoom ? canvas.getZoom() : 1;
    const width = canvas.getWidth ? canvas.getWidth() : 800;
    const height = canvas.getHeight ? canvas.getHeight() : 600;
    
    // Calculate viewport bounds
    const bounds = {
      left: -vpt[4] / zoom,
      top: -vpt[5] / zoom,
      right: (-vpt[4] + width) / zoom,
      bottom: (-vpt[5] + height) / zoom,
    };
    
    setViewportBounds(bounds);
    return bounds;
  }, [canvasRef]);
  
  /**
   * Update object visibility based on viewport
   */
  const updateObjectVisibility = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isEnabled) return;
    
    const bounds = updateViewportBounds() || viewportBounds;
    if (!bounds) return;
    
    // Process all objects
    const objectsToProcess = [...(canvas.getObjects ? canvas.getObjects() : [])];
    const visibleObjects = visibleObjectsRef.current;
    const offscreenObjects = offscreenObjectsRef.current;
    
    visibleObjects.clear();
    offscreenObjects.clear();
    
    // Process each object
    objectsToProcess.forEach(obj => {
      if (!obj) return;
      
      // Skip objects marked for skipping
      if ((obj as any).skipVirtualization) return;
      
      // Check if object is in viewport
      if (isObjectInViewport(obj, bounds)) {
        visibleObjects.add(obj);
        // Make object visible and enable caching
        if (obj.visible === false) {
          obj.set('visible', true);
        }
        if (obj.objectCaching === false) {
          obj.set('objectCaching', true);
        }
      } else {
        offscreenObjects.add(obj);
        // Make object invisible and disable caching
        if (obj.visible !== false) {
          obj.set('visible', false);
        }
        if (obj.objectCaching !== false) {
          obj.set('objectCaching', false);
        }
      }
    });
    
    canvas.renderAll();
  }, [canvasRef, isEnabled, isObjectInViewport, updateViewportBounds, viewportBounds]);
  
  // Debounce and throttle for better performance
  const debouncedUpdateVisibility = useRef(
    debounce(() => {
      updateObjectVisibility();
    }, 100)
  ).current;
  
  const throttledUpdateVisibility = useRef(
    throttle(() => {
      updateObjectVisibility();
    }, 100)
  ).current;
  
  /**
   * Enable virtualization
   */
  const enableVirtualization = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsEnabled(true);
    
    // Set skipOffscreen to true for better performance
    if ('skipOffscreen' in canvas) {
      (canvas as any).skipOffscreen = true;
    }
    
    updateObjectVisibility();
  }, [canvasRef, updateObjectVisibility]);
  
  /**
   * Disable virtualization
   */
  const disableVirtualization = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsEnabled(false);
    
    // Restore all objects to visible state
    const allObjects = canvas.getObjects ? canvas.getObjects() : [];
    allObjects.forEach(obj => {
      if (obj && obj.visible === false) {
        obj.set('visible', true);
      }
    });
    
    // Disable skipOffscreen
    if ('skipOffscreen' in canvas) {
      (canvas as any).skipOffscreen = false;
    }
    
    canvas.renderAll();
  }, [canvasRef]);
  
  /**
   * Register event handlers
   */
  const registerEvents = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isEnabled) return;
    
    // Attach event handlers
    if (canvas.on) {
      canvas.on('object:moving', throttledUpdateVisibility);
      canvas.on('object:scaling', throttledUpdateVisibility);
      canvas.on('object:rotating', throttledUpdateVisibility);
      canvas.on('mouse:wheel', throttledUpdateVisibility);
      canvas.on('zoom:changed', debouncedUpdateVisibility);
      canvas.on('viewport:translate', debouncedUpdateVisibility);
    }
    
    // Initial update
    updateObjectVisibility();
    
  }, [canvasRef, isEnabled, debouncedUpdateVisibility, throttledUpdateVisibility, updateObjectVisibility]);
  
  /**
   * Unregister event handlers
   */
  const unregisterEvents = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Detach event handlers
    if (canvas.off) {
      canvas.off('object:moving', throttledUpdateVisibility);
      canvas.off('object:scaling', throttledUpdateVisibility);
      canvas.off('object:rotating', throttledUpdateVisibility);
      canvas.off('mouse:wheel', throttledUpdateVisibility);
      canvas.off('zoom:changed', debouncedUpdateVisibility);
      canvas.off('viewport:translate', debouncedUpdateVisibility);
    }
    
  }, [canvasRef, debouncedUpdateVisibility, throttledUpdateVisibility]);
  
  // Effect to handle setup and cleanup
  useEffect(() => {
    if (isEnabled) {
      registerEvents();
    } else {
      unregisterEvents();
    }
    
    return () => {
      // Clean up
      unregisterEvents();
      if (typeof debouncedUpdateVisibility.cancel === 'function') {
        debouncedUpdateVisibility.cancel();
      }
      if (typeof throttledUpdateVisibility.cancel === 'function') {
        throttledUpdateVisibility.cancel();
      }
    };
  }, [isEnabled, registerEvents, unregisterEvents, debouncedUpdateVisibility, throttledUpdateVisibility]);
  
  return {
    isEnabled,
    enableVirtualization,
    disableVirtualization,
    visibleObjects: visibleObjectsRef.current,
    offscreenObjects: offscreenObjectsRef.current,
    viewportBounds,
    updateObjectVisibility
  };
};

export default useVirtualizationEngine;
