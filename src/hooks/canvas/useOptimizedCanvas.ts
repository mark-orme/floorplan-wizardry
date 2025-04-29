/**
 * Master hook for canvas optimization combining virtualization and metrics
 */
import { useCallback, useMemo, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useVirtualizationEngine } from './useVirtualizationEngine';
import { useCanvasMetrics } from './useCanvasMetrics';
import logger from '@/utils/logger';

interface UseOptimizedCanvasProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  viewportWidth: number;
  viewportHeight: number;
  objectLimit?: number;
}

export const useOptimizedCanvas = ({
  fabricCanvasRef,
  viewportWidth,
  viewportHeight,
  objectLimit = 500
}: UseOptimizedCanvasProps) => {
  // Use virtualization engine
  const {
    needsVirtualization,
    visibleArea,
    visibleObjectCount,
    updateVirtualization,
    setVirtualization
  } = useVirtualizationEngine({
    fabricCanvasRef,
    viewportWidth,
    viewportHeight
  });
  
  // Use canvas metrics
  const { metrics, updateObjectCount } = useCanvasMetrics({
    fabricCanvasRef
  });
  
  // Combine metrics with virtualization data
  const performanceMetrics = useMemo(() => {
    return {
      ...metrics,
      visibleObjectCount
    };
  }, [metrics, visibleObjectCount]);
  
  // Monitor object count and enable virtualization if needed
  const checkObjectCount = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const objectCount = objects.length;
    
    // Update object count in metrics
    updateObjectCount(visibleObjectCount);
    
    // Enable virtualization if object count exceeds limit
    if (objectCount > objectLimit && !needsVirtualization) {
      setVirtualization(true);
      logger.info(`Enabling virtualization - Object count (${objectCount}) exceeds limit (${objectLimit})`);
    } else if (objectCount <= objectLimit && needsVirtualization) {
      setVirtualization(false);
      logger.info(`Disabling virtualization - Object count (${objectCount}) below limit`);
    }
  }, [fabricCanvasRef, needsVirtualization, objectLimit, updateObjectCount, visibleObjectCount, setVirtualization]);
  
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
  
  // Attach viewport change events
  const attachVirtualizationEvents = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return () => {};
    
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
    canvas.on('mouse:wheel', handleViewportChange);
    canvas.on('mouse:down', handleViewportChange);
    canvas.on('mouse:up', handleViewportChange);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    // Clean up function
    return () => {
      canvas.off('mouse:wheel', handleViewportChange);
      canvas.off('mouse:down', handleViewportChange);
      canvas.off('mouse:up', handleViewportChange);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [checkObjectCount, fabricCanvasRef, needsVirtualization, updateVirtualization]);
  
  return {
    performanceMetrics,
    needsVirtualization,
    visibleArea,
    checkObjectCount,
    updateVirtualization,
    optimizeCanvasSettings,
    attachVirtualizationEvents
  };
};
