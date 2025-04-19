/**
 * Hook for managing a WebGL-accelerated canvas
 * @module hooks/useWebGLCanvas
 */
import { useRef, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { Point } from '@/types/core/Point';
import { CanvasDimensions } from '@/types/drawingTypes';
import { vibrateFeedback } from '@/utils/canvas/pointerEvents';

interface UseWebGLCanvasProps {
  width: number;
  height: number;
}

/**
 * Hook for managing a WebGL-accelerated canvas
 */
export const useWebGLCanvas = ({ width, height }: UseWebGLCanvasProps) => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const performanceMetricsRef = useRef({
    objectCount: 0,
    visibleObjectCount: 0,
    fps: 0
  });
  
  /**
   * Initialize the Fabric.js canvas
   */
  const initializeCanvas = useCallback((canvasElement: HTMLCanvasElement) => {
    // Create Fabric canvas instance
    const canvas = new fabric.Canvas(canvasElement, {
      width,
      height,
      backgroundColor: '#fff',
      renderOnAddRemove: true,
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      fireRightClick: true
    });
    
    // Set canvas ref
    canvasRef.current = canvas;
    
    // Update performance metrics
    performanceMetricsRef.current.objectCount = canvas.getObjects().length;
    performanceMetricsRef.current.visibleObjectCount = canvas.getObjects().length;
    
    // Set event handlers
    canvas.on('object:added', () => {
      performanceMetricsRef.current.objectCount = canvas.getObjects().length;
      performanceMetricsRef.current.visibleObjectCount = canvas.getObjects().length;
    });
    
    canvas.on('object:removed', () => {
      performanceMetricsRef.current.objectCount = canvas.getObjects().length;
      performanceMetricsRef.current.visibleObjectCount = canvas.getObjects().length;
    });
    
    canvas.on('object:modified', () => {
      performanceMetricsRef.current.objectCount = canvas.getObjects().length;
      performanceMetricsRef.current.visibleObjectCount = canvas.getObjects().length;
    });
    
    // Start performance monitoring
    startPerformanceMonitoring(canvas);
    
    return canvas;
  }, [width, height]);
  
  /**
   * Start performance monitoring
   */
  const startPerformanceMonitoring = useCallback((canvas: fabric.Canvas) => {
    let lastRenderTime = Date.now();
    let frameCount = 0;
    
    // Performance monitoring loop
    const monitor = () => {
      const now = Date.now();
      const delta = now - lastRenderTime;
      
      frameCount++;
      
      if (delta >= 1000) {
        performanceMetricsRef.current.fps = frameCount;
        frameCount = 0;
        lastRenderTime = now;
      }
      
      requestAnimationFrame(monitor);
    };
    
    monitor();
  }, []);
  
  /**
   * Check if canvas needs virtualization
   */
  const needsVirtualization = useCallback(() => {
    if (!canvasRef.current) return false;
    
    const objectCount = canvasRef.current.getObjects().length;
    return objectCount > 100;
  }, []);
  
  /**
   * Refresh virtualization
   */
  const refreshVirtualization = useCallback(() => {
    if (!canvasRef.current) return;
    
    // Implement virtualization logic here
    console.log('Refreshing virtualization');
  }, []);
  
  /**
   * Handle canvas click
   */
  const handleCanvasClick = useCallback((event: MouseEvent) => {
    if (!canvasRef.current) return;
    
    // Get click coordinates
    const pointer = canvasRef.current.getPointer(event);
    
    // Create a circle
    const circle = new fabric.Circle({
      left: pointer.x,
      top: pointer.y,
      radius: 10,
      fill: 'red',
      originX: 'center',
      originY: 'center'
    });
    
    // Add to canvas
    canvasRef.current.add(circle);
    
    // Provide haptic feedback
    vibrateFeedback(20);
    
    // Update performance metrics
    performanceMetricsRef.current.objectCount = canvasRef.current.getObjects().length;
    performanceMetricsRef.current.visibleObjectCount = canvasRef.current.getObjects().length;
  }, []);
  
  /**
   * Get performance metrics
   */
  const performanceMetrics = {
    objectCount: performanceMetricsRef.current.objectCount,
    visibleObjectCount: performanceMetricsRef.current.visibleObjectCount,
    fps: performanceMetricsRef.current.fps
  };
  
  return {
    canvasRef,
    initializeCanvas,
    handleCanvasClick,
    performanceMetrics,
    needsVirtualization,
    refreshVirtualization
  };
};
