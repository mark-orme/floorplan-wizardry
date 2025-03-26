
/**
 * Custom hook for canvas debugging and performance monitoring
 * @module useCanvasDebug
 */
import { useState, useEffect } from "react";
import { useCanvasPerformance } from "./useCanvasPerformance";
import { DebugInfoState } from "@/types/debugTypes";

/**
 * Hook for managing debug information and performance metrics
 * @returns Debug information and setters
 */
export const useCanvasDebug = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    canvasInitialized: false,
    gridCreated: false,
    dimensionsSet: false,
    brushInitialized: false,
    canvasCreated: false,
    canvasLoaded: false,
    canvasReady: false,
    canvasWidth: 0,
    canvasHeight: 0,
    lastInitTime: 0,
    lastGridCreationTime: 0,
    // Optional properties
    gridObjects: 0,
    canvasObjects: 0,
    devicePixelRatio: window.devicePixelRatio || 1,
    lastError: undefined,
    lastErrorTime: 0,
    performanceStats: {
      fps: 0,
      renderTime: 0,
      gridCreationTime: 0,
      objectCreationTime: 0,
      droppedFrames: 0,
      frameTime: 0,
      maxFrameTime: 0,
      longFrames: 0
    }
  });
  
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Use the dedicated performance hook
  const { 
    loadTimes, 
    markCanvasReady, 
    markGridCreated, 
    resetPerformanceTimers,
    performanceMetrics,
    startPerformanceTracking,
    stopPerformanceTracking
  } = useCanvasPerformance();

  // Track debug info changes for performance metrics
  useEffect(() => {
    if (debugInfo.canvasInitialized) {
      markCanvasReady();
    }
    
    if (debugInfo.gridCreated) {
      markGridCreated();
    }
    
    // Update performance stats in debug info
    setDebugInfo(prev => ({
      ...prev,
      performanceStats: {
        fps: performanceMetrics.fps,
        renderTime: prev.performanceStats?.renderTime,
        gridCreationTime: prev.performanceStats?.gridCreationTime,
        objectCreationTime: prev.performanceStats?.objectCreationTime,
        droppedFrames: performanceMetrics.droppedFrames,
        frameTime: performanceMetrics.frameTime,
        maxFrameTime: performanceMetrics.maxFrameTime,
        longFrames: performanceMetrics.longFrames
      }
    }));
  }, [
    debugInfo.canvasInitialized, 
    debugInfo.gridCreated, 
    markCanvasReady, 
    markGridCreated,
    performanceMetrics
  ]);

  // Start performance tracking when canvas is initialized
  useEffect(() => {
    if (debugInfo.canvasInitialized) {
      startPerformanceTracking();
      
      return () => {
        stopPerformanceTracking();
      };
    }
  }, [debugInfo.canvasInitialized, startPerformanceTracking, stopPerformanceTracking]);

  const resetLoadTimes = () => {
    resetPerformanceTimers();
  };

  return {
    debugInfo,
    setDebugInfo,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    loadTimes,
    resetLoadTimes,
    performanceMetrics,
    startPerformanceTracking,
    stopPerformanceTracking
  };
};
