
import { useState, useCallback, useEffect } from 'react';
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
  
  // Update object counts
  const updateObjectCount = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
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
  }, [fabricCanvasRef, needsVirtualization, objectLimit]);
  
  // Update virtualization
  const updateVirtualization = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !needsVirtualization) return;
    
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
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef, needsVirtualization]);
  
  // Track FPS
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    const interval = 1000; // 1 second for FPS calculation
    
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
      
      requestAnimationFrame(updateFPS);
    };
    
    const frameId = requestAnimationFrame(updateFPS);
    
    // Setup canvas event listeners
    const handleObjectAdded = () => {
      updateObjectCount();
    };
    
    const handleObjectRemoved = () => {
      updateObjectCount();
    };
    
    const handleViewportChange = () => {
      if (needsVirtualization) {
        updateVirtualization();
      }
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
    };
  }, [fabricCanvasRef, needsVirtualization, updateObjectCount, updateVirtualization]);
  
  return {
    performanceMetrics,
    needsVirtualization,
    updateVirtualization
  };
};
