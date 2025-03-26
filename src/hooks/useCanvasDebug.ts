
/**
 * Custom hook for canvas debugging and performance monitoring
 * Provides debug information, error state, and performance metrics
 * @module useCanvasDebug
 */
import { useState, useEffect } from "react";
import { useCanvasPerformance } from "./useCanvasPerformance";
import { DebugInfoState } from "@/types/debugTypes";

/**
 * Default performance values for initialization
 */
const DEFAULT_PERFORMANCE_STATS = {
  fps: 0,
  renderTime: 0,
  gridCreationTime: 0,
  objectCreationTime: 0,
  droppedFrames: 0,
  frameTime: 0,
  maxFrameTime: 0,
  longFrames: 0
};

/**
 * Hook for managing debug information and performance metrics
 * @returns {Object} Debug information, error state, and related functions
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
    // Initialize optional properties with defaults
    gridObjects: 0,
    canvasObjects: 0,
    devicePixelRatio: window.devicePixelRatio || 1,
    lastError: undefined,
    lastErrorTime: 0,
    performanceStats: { ...DEFAULT_PERFORMANCE_STATS }
  });
  
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
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

  /**
   * Track debug info changes for performance metrics
   * Updates performance stats when canvas is initialized or grid is created
   */
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
        renderTime: prev.performanceStats?.renderTime || 0,
        gridCreationTime: prev.performanceStats?.gridCreationTime || 0,
        objectCreationTime: prev.performanceStats?.objectCreationTime || 0,
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

  /**
   * Start performance tracking when canvas is initialized
   * Cleans up tracking when component unmounts
   */
  useEffect(() => {
    if (debugInfo.canvasInitialized) {
      startPerformanceTracking();
      
      return () => {
        stopPerformanceTracking();
      };
    }
  }, [debugInfo.canvasInitialized, startPerformanceTracking, stopPerformanceTracking]);

  /**
   * Reset performance timing data
   */
  const resetLoadTimes = (): void => {
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
