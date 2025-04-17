
/**
 * Hook for canvas rendering optimization
 * Provides utilities for memoization and virtualization
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { useMemo } from 'react';
import logger from '@/utils/logger';

interface UseCanvasOptimizationProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  viewportWidth: number;
  viewportHeight: number;
  objectLimit?: number;
}

export const useCanvasOptimization = ({
  fabricCanvasRef,
  viewportWidth,
  viewportHeight,
  objectLimit = 500
}: UseCanvasOptimizationProps) => {
  // Track whether we need virtualization
  const [needsVirtualization, setNeedsVirtualization] = useState(false);
  
  // Track visible area for virtualization
  const visibleAreaRef = useRef({
    left: 0,
    top: 0,
    right: viewportWidth,
    bottom: viewportHeight
  });
  
  // Track performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 0,
    renderTime: 0,
    objectCount: 0,
    visibleObjectCount: 0
  });
  
  // Virtual canvas rendering optimization
  // Only render objects that are in or near the viewport
  const updateVirtualization = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !needsVirtualization) return;
    
    // Get current viewport transform
    const vpt = canvas.viewportTransform;
    if (!vpt) return;
    
    // Calculate visible area with padding
    const zoom = canvas.getZoom() || 1;
    const padding = 200; // Extra padding around viewport to prevent pop-in
    
    const visibleArea = {
      left: -vpt[4] / zoom - padding,
      top: -vpt[5] / zoom - padding,
      right: (-vpt[4] + canvas.width!) / zoom + padding,
      bottom: (-vpt[5] + canvas.height!) / zoom + padding
    };
    
    // Update reference
    visibleAreaRef.current = visibleArea;
    
    // Only render objects in or near the visible area
    let visibleCount = 0;
    
    canvas.forEachObject((obj) => {
      // Skip grid objects which should always be visible
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
      
      if (isVisible) {
        visibleCount++;
      }
    });
    
    // Log virtualization metrics
    logger.debug('Virtualization update', {
      totalObjects: canvas.getObjects().length,
      visibleObjects: visibleCount,
      zoom,
      visibleArea
    });
    
    // Update metrics
    setPerformanceMetrics(prev => ({
      ...prev,
      visibleObjectCount: visibleCount
    }));
    
  }, [fabricCanvasRef, needsVirtualization]);
  
  // Monitor object count and enable virtualization if needed
  const checkObjectCount = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const objectCount = objects.length;
    
    // Update object count in metrics
    setPerformanceMetrics(prev => ({
      ...prev,
      objectCount
    }));
    
    // Enable virtualization if object count exceeds limit
    if (objectCount > objectLimit && !needsVirtualization) {
      setNeedsVirtualization(true);
      logger.info(`Enabling virtualization - Object count (${objectCount}) exceeds limit (${objectLimit})`);
    } else if (objectCount <= objectLimit && needsVirtualization) {
      setNeedsVirtualization(false);
      
      // Reset all object visibility
      objects.forEach(obj => {
        if (obj.visible !== undefined) {
          obj.visible = true;
        }
      });
      
      logger.info(`Disabling virtualization - Object count (${objectCount}) below limit`);
    }
  }, [fabricCanvasRef, needsVirtualization, objectLimit]);
  
  // Set up canvas event listeners
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Initial check
    checkObjectCount();
    
    // Track performance
    let frameCount = 0;
    let lastFpsUpdateTime = performance.now();
    let lastRenderTime = 0;
    
    // After render event handler
    const handleAfterRender = () => {
      frameCount++;
      
      const now = performance.now();
      const elapsed = now - lastRenderTime;
      lastRenderTime = now;
      
      // Update FPS every second
      if (now - lastFpsUpdateTime > 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastFpsUpdateTime));
        
        setPerformanceMetrics(prev => ({
          ...prev,
          fps,
          renderTime: elapsed
        }));
        
        frameCount = 0;
        lastFpsUpdateTime = now;
      }
    };
    
    // Set up viewport change handlers for virtualization
    const handleViewportChange = () => {
      if (needsVirtualization) {
        updateVirtualization();
      }
    };
    
    // Object handlers
    const handleObjectAdded = () => {
      checkObjectCount();
    };
    
    const handleObjectRemoved = () => {
      checkObjectCount();
    };
    
    // Register event handlers
    canvas.on('after:render', handleAfterRender);
    canvas.on('mouse:wheel', handleViewportChange);
    canvas.on('mouse:down', handleViewportChange);
    canvas.on('mouse:up', handleViewportChange);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    // Run initial virtualization if needed
    if (needsVirtualization) {
      updateVirtualization();
    }
    
    // Clean up
    return () => {
      if (canvas) {
        canvas.off('after:render', handleAfterRender);
        canvas.off('mouse:wheel', handleViewportChange);
        canvas.off('mouse:down', handleViewportChange);
        canvas.off('mouse:up', handleViewportChange);
        canvas.off('object:added', handleObjectAdded);
        canvas.off('object:removed', handleObjectRemoved);
      }
    };
  }, [
    fabricCanvasRef, 
    needsVirtualization, 
    updateVirtualization, 
    checkObjectCount
  ]);
  
  // Optimize canvas settings
  const optimizeCanvasSettings = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Optimize render settings
    canvas.renderOnAddRemove = false;
    canvas.skipTargetFind = needsVirtualization;
    canvas.enableRetinaScaling = true; // Better on high-DPI displays
    
    // Object caching settings
    canvas.forEachObject(obj => {
      // Enable object caching for better performance
      // but disable for complex objects that change frequently
      const isComplex = obj.type === 'path' || obj.type === 'group';
      obj.objectCaching = !isComplex;
    });
    
    logger.info('Canvas settings optimized', { needsVirtualization });
  }, [fabricCanvasRef, needsVirtualization]);
  
  // Memoized function to get an object by ID efficiently
  const getObjectById = useCallback((id: string): FabricObject | undefined => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return undefined;
    
    // Use the standard method to find objects
    return canvas.getObjects().find(obj => (obj as any).id === id);
  }, [fabricCanvasRef]);
  
  // Apply optimizations on mount and when virtualization needs change
  useEffect(() => {
    optimizeCanvasSettings();
  }, [optimizeCanvasSettings, needsVirtualization]);
  
  return {
    performanceMetrics,
    needsVirtualization,
    visibleArea: visibleAreaRef.current,
    getObjectById,
    forceOptimize: optimizeCanvasSettings,
    forceVirtualizationUpdate: updateVirtualization
  };
};
