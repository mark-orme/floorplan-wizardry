
import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface UseCanvasOptimizationProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  viewportWidth: number;
  viewportHeight: number;
  objectLimit?: number;
}

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  objectCount: number;
  visibleObjectCount: number;
}

export const useCanvasOptimization = ({
  fabricCanvasRef,
  viewportWidth,
  viewportHeight,
  objectLimit = 500
}: UseCanvasOptimizationProps) => {
  // Track whether we need virtualization
  const [needsVirtualization, setNeedsVirtualization] = useState(false);
  
  // Track performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    renderTime: 0,
    objectCount: 0,
    visibleObjectCount: 0
  });
  
  // Ref to track last update time to avoid too frequent updates
  const lastUpdateTimeRef = useRef(0);
  const updateIntervalMs = 500; // Only update every 500ms
  
  // Update object counts
  const updateObjectCount = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const now = performance.now();
    if (now - lastUpdateTimeRef.current < updateIntervalMs) {
      return; // Skip update if too soon
    }
    lastUpdateTimeRef.current = now;
    
    try {
      const objectCount = canvas.getObjects().length;
      
      setPerformanceMetrics(prev => ({
        ...prev,
        objectCount
      }));
      
      // Enable virtualization if object count exceeds limit
      if (objectCount > objectLimit && !needsVirtualization) {
        setNeedsVirtualization(true);
      } else if (objectCount <= objectLimit && needsVirtualization) {
        setNeedsVirtualization(false);
      }
    } catch (error) {
      console.error("Error updating object count:", error);
    }
  }, [fabricCanvasRef, needsVirtualization, objectLimit]);
  
  // Update virtualization
  const updateVirtualization = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !needsVirtualization) return;
    
    const now = performance.now();
    if (now - lastUpdateTimeRef.current < updateIntervalMs) {
      return; // Skip update if too soon
    }
    
    try {
      // Get current viewport transform
      const vpt = canvas.viewportTransform;
      if (!vpt) return;
      
      // Calculate visible area with padding
      const zoom = canvas.getZoom() || 1;
      const padding = 100; // Extra padding around viewport
      
      const visibleArea = {
        left: -vpt[4] / zoom - padding,
        top: -vpt[5] / zoom - padding,
        right: (-vpt[4] + canvas.width!) / zoom + padding,
        bottom: (-vpt[5] + canvas.height!) / zoom + padding
      };
      
      // Only render objects in or near the visible area
      let visibleCount = 0;
      
      canvas.forEachObject((obj) => {
        // Skip grid objects
        if ((obj as any).isGrid) return;
        
        const objBounds = obj.getBoundingRect();
        
        // Check if object is in visible area
        const isVisible = !(
          objBounds.left > visibleArea.right ||
          objBounds.top > visibleArea.bottom ||
          objBounds.left + objBounds.width < visibleArea.left ||
          objBounds.top + objBounds.height < visibleArea.top
        );
        
        // Update object visibility
        if (isVisible !== obj.visible) {
          obj.visible = isVisible;
          obj.setCoords();
        }
        
        if (isVisible) visibleCount++;
      });
      
      // Update metrics
      setPerformanceMetrics(prev => ({
        ...prev,
        visibleObjectCount: visibleCount
      }));
    } catch (error) {
      console.error("Error updating virtualization:", error);
    }
  }, [fabricCanvasRef, needsVirtualization]);
  
  // Force optimization
  const forceOptimize = useCallback(() => {
    // Force update object count
    updateObjectCount();
    
    // Force update virtualization if needed
    if (needsVirtualization) {
      updateVirtualization();
    }
    
    // Optimize canvas settings
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Set render settings
      canvas.renderOnAddRemove = false;
      canvas.skipTargetFind = needsVirtualization;
      canvas.enableRetinaScaling = true;
      
      // Configure object caching
      canvas.forEachObject(obj => {
        const isComplex = obj.type === 'path' || obj.type === 'group';
        obj.objectCaching = !isComplex;
      });
      
      // Force render update
      canvas.requestRenderAll();
    } catch (error) {
      console.error("Error forcing optimization:", error);
    }
  }, [fabricCanvasRef, needsVirtualization, updateObjectCount, updateVirtualization]);
  
  // Track FPS
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    const interval = 1000; // 1 second for FPS calculation
    let frameId: number;
    
    const updateFPS = () => {
      const now = performance.now();
      frameCount++;
      
      // Update FPS every second
      if (now - lastTime >= interval) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        setPerformanceMetrics(prev => ({
          ...prev,
          fps
        }));
        
        frameCount = 0;
        lastTime = now;
      }
      
      frameId = requestAnimationFrame(updateFPS);
    };
    
    frameId = requestAnimationFrame(updateFPS);
    
    // Setup canvas event listeners with debouncing
    let addRemoveTimeout: ReturnType<typeof setTimeout> | null = null;
    let viewportTimeout: ReturnType<typeof setTimeout> | null = null;
    
    const handleObjectAdded = () => {
      if (addRemoveTimeout) clearTimeout(addRemoveTimeout);
      addRemoveTimeout = setTimeout(() => {
        updateObjectCount();
      }, 100);
    };
    
    const handleObjectRemoved = () => {
      if (addRemoveTimeout) clearTimeout(addRemoveTimeout);
      addRemoveTimeout = setTimeout(() => {
        updateObjectCount();
      }, 100);
    };
    
    const handleViewportChange = () => {
      if (viewportTimeout) clearTimeout(viewportTimeout);
      viewportTimeout = setTimeout(() => {
        if (needsVirtualization) {
          updateVirtualization();
        }
      }, 100);
    };
    
    // Initial updates
    updateObjectCount();
    if (needsVirtualization) {
      updateVirtualization();
    }
    
    // Register event handlers
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('mouse:wheel', handleViewportChange);
    canvas.on('mouse:up', handleViewportChange);
    
    return () => {
      cancelAnimationFrame(frameId);
      
      if (canvas) {
        canvas.off('object:added', handleObjectAdded);
        canvas.off('object:removed', handleObjectRemoved);
        canvas.off('mouse:wheel', handleViewportChange);
        canvas.off('mouse:up', handleViewportChange);
      }
      
      if (addRemoveTimeout) clearTimeout(addRemoveTimeout);
      if (viewportTimeout) clearTimeout(viewportTimeout);
    };
  }, [fabricCanvasRef, needsVirtualization, updateObjectCount, updateVirtualization]);
  
  return {
    performanceMetrics,
    needsVirtualization,
    updateVirtualization,
    forceOptimize
  };
};
