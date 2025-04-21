/**
 * Canvas Performance Monitor Hook
 * 
 * Provides utilities for monitoring and optimizing canvas performance
 * Combines virtualization, performance metrics, and optimized rendering
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { debounce, throttle } from '@/utils/canvas/performanceTracker';

interface UseCanvasPerformanceMonitorProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  enabled?: boolean;
  viewportWidth?: number;
  viewportHeight?: number;
  virtualizationPadding?: number;
  measurementInterval?: number;
}

interface PerformanceData {
  fps: number;
  renderTime: number;
  objectCount: number;
  visibleObjectCount: number;
  lastRenderTimestamp: number;
  frameDrops: number;
}

export function useCanvasPerformanceMonitor({
  fabricCanvasRef,
  enabled = true,
  viewportWidth = window.innerWidth,
  viewportHeight = window.innerHeight,
  virtualizationPadding = 200,
  measurementInterval = 1000
}: UseCanvasPerformanceMonitorProps) {
  // Performance metrics state
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    fps: 0,
    renderTime: 0,
    objectCount: 0,
    visibleObjectCount: 0,
    lastRenderTimestamp: 0,
    frameDrops: 0
  });
  
  // Virtualization state
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(enabled);
  const frameCountRef = useRef(0);
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(0);
  const measurementStartTimeRef = useRef(0);
  
  // Track visible area for virtualization
  const visibleAreaRef = useRef({
    left: 0,
    top: 0,
    right: viewportWidth,
    bottom: viewportHeight
  });
  
  /**
   * Update canvas virtualization - only render objects in viewport
   */
  const updateVirtualization = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !virtualizationEnabled) return;
    
    // Get viewport transform
    const vpt = canvas.viewportTransform;
    if (!vpt) return;
    
    // Calculate visible area with padding
    const zoom = canvas.getZoom() || 1;
    const visibleArea = {
      left: -vpt[4] / zoom - virtualizationPadding,
      top: -vpt[5] / zoom - virtualizationPadding,
      right: (-vpt[4] + canvas.width!) / zoom + virtualizationPadding,
      bottom: (-vpt[5] + canvas.height!) / zoom + virtualizationPadding
    };
    
    // Update reference
    visibleAreaRef.current = visibleArea;
    
    // Count visible objects
    let visibleCount = 0;
    
    // Update object visibility based on whether they're in the viewport
    canvas.forEachObject((obj) => {
      // Skip grid objects - they should always be visible
      if ((obj as any).isGrid) return;
      
      const bounds = obj.getBoundingRect();
      
      // Check if object is in visible area
      const isVisible = !(
        bounds.left > visibleArea.right ||
        bounds.top > visibleArea.bottom ||
        bounds.left + bounds.width < visibleArea.left ||
        bounds.top + bounds.height < visibleArea.top
      );
      
      // Update object visibility if needed
      if (isVisible !== obj.visible) {
        obj.visible = isVisible;
        obj.setCoords();
      }
      
      if (isVisible) visibleCount++;
    });
    
    // Update metrics with visible object count
    setPerformanceData(prev => ({
      ...prev,
      visibleObjectCount: visibleCount
    }));
    
    // Request render if needed
    canvas.requestRenderAll();
  }, [fabricCanvasRef, virtualizationEnabled, virtualizationPadding]);
  
  // Throttled version to avoid excessive updates
  const throttledUpdateVirtualization = useCallback(
    throttle(updateVirtualization, 100),
    [updateVirtualization]
  );
  
  /**
   * Track a frame for performance measurement
   */
  const trackFrame = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;
    
    // Calculate frame time
    if (lastFrameTimeRef.current > 0) {
      const frameTime = now - lastFrameTimeRef.current;
      frameTimesRef.current.push(frameTime);
      
      // Keep only the last 60 frame times
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }
    }
    
    lastFrameTimeRef.current = now;
    
    // Update metrics once per measurement interval
    if (!measurementStartTimeRef.current) {
      measurementStartTimeRef.current = now;
    } else if (now - measurementStartTimeRef.current >= measurementInterval) {
      // Calculate FPS
      const fps = Math.round((frameCountRef.current * 1000) / (now - measurementStartTimeRef.current));
      
      // Calculate average frame time
      const avgFrameTime = frameTimesRef.current.length > 0
        ? frameTimesRef.current.reduce((sum, time) => sum + time, 0) / frameTimesRef.current.length
        : 0;
      
      // Calculate dropped frames (frames taking > 16.7ms are considered dropped at 60fps)
      const droppedFrames = frameTimesRef.current.filter(time => time > 16.7).length;
      
      // Get object counts
      const canvas = fabricCanvasRef.current;
      const objectCount = canvas ? canvas.getObjects().length : 0;
      
      // Update metrics
      setPerformanceData({
        fps,
        renderTime: avgFrameTime,
        objectCount,
        visibleObjectCount: performanceData.visibleObjectCount,
        lastRenderTimestamp: now,
        frameDrops: droppedFrames
      });
      
      // Reset measurement
      frameCountRef.current = 0;
      measurementStartTimeRef.current = now;
    }
  }, [fabricCanvasRef, measurementInterval, performanceData.visibleObjectCount]);
  
  /**
   * Reset all performance metrics
   */
  const resetMetrics = useCallback(() => {
    frameCountRef.current = 0;
    frameTimesRef.current = [];
    lastFrameTimeRef.current = 0;
    measurementStartTimeRef.current = 0;
    
    setPerformanceData({
      fps: 0,
      renderTime: 0,
      objectCount: 0,
      visibleObjectCount: 0,
      lastRenderTimestamp: 0,
      frameDrops: 0
    });
  }, []);
  
  /**
   * Toggle virtualization on/off
   */
  const toggleVirtualization = useCallback(() => {
    setVirtualizationEnabled(prev => {
      const newValue = !prev;
      
      // If disabling virtualization, make all objects visible
      if (!newValue && fabricCanvasRef.current) {
        fabricCanvasRef.current.getObjects().forEach(obj => {
          obj.visible = true;
        });
        fabricCanvasRef.current.requestRenderAll();
      }
      
      return newValue;
    });
  }, [fabricCanvasRef]);
  
  // Set up event listeners for canvas movement and zoom
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !enabled) return;
    
    // Set up performance monitoring
    let animationFrameId: number;
    
    const renderCallback = () => {
      if (enabled) {
        trackFrame();
      }
      animationFrameId = requestAnimationFrame(renderCallback);
    };
    
    animationFrameId = requestAnimationFrame(renderCallback);
    
    // Pan and zoom handlers for virtualization
    const handleObjectMoving = () => throttledUpdateVirtualization();
    const handleCanvasModified = () => throttledUpdateVirtualization();
    const handleZoom = () => throttledUpdateVirtualization();
    const handleViewportTransform = () => throttledUpdateVirtualization();
    
    // Add event listeners
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:modified', handleCanvasModified);
    canvas.on('zoom', handleZoom);
    canvas.on('viewport:transform', handleViewportTransform);
    
    // Initial virtualization
    updateVirtualization();
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('object:modified', handleCanvasModified);
      canvas.off('zoom', handleZoom);
      canvas.off('viewport:transform', handleViewportTransform);
    };
  }, [
    fabricCanvasRef, 
    enabled, 
    trackFrame, 
    updateVirtualization, 
    throttledUpdateVirtualization
  ]);
  
  // Update virtualization when viewport size changes
  useEffect(() => {
    updateVirtualization();
  }, [viewportWidth, viewportHeight, updateVirtualization]);
  
  return {
    performanceData,
    virtualizationEnabled,
    toggleVirtualization,
    updateVirtualization,
    resetMetrics,
    visibleArea: visibleAreaRef.current
  };
}
