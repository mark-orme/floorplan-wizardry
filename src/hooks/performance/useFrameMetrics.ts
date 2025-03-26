
/**
 * Custom hook for tracking frame-by-frame performance metrics
 * Measures FPS, frame drops, and other performance indicators
 * @module useFrameMetrics
 */
import { useState, useCallback, useRef } from "react";
import type { PerformanceMetrics } from "@/types/performanceTypes";

/**
 * Initial performance metrics state
 */
const DEFAULT_METRICS: PerformanceMetrics = {
  fps: 0,
  droppedFrames: 0,
  frameTime: 0,
  maxFrameTime: 0,
  longFrames: 0,
  measuredSince: 0
};

/**
 * Hook for measuring and tracking frame-level performance
 * @returns Performance metric state and tracking functions
 */
export const useFrameMetrics = () => {
  // State to store performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>(DEFAULT_METRICS);
  
  // Refs to track metrics between frames
  const metricsRef = useRef({
    frames: 0,
    startTime: 0,
    lastFrameTime: 0,
    totalFrameTime: 0,
    droppedFrames: 0,
    maxFrameTime: 0,
    longFrames: 0,
    tracking: false
  });
  
  /**
   * Start performance tracking
   * Resets counters and begins measuring
   */
  const startPerformanceTracking = useCallback(() => {
    const now = performance.now();
    
    // Reset metric tracking
    metricsRef.current = {
      frames: 0,
      startTime: now,
      lastFrameTime: now,
      totalFrameTime: 0,
      droppedFrames: 0,
      maxFrameTime: 0,
      longFrames: 0,
      tracking: true
    };
    
    setPerformanceMetrics({
      ...DEFAULT_METRICS,
      measuredSince: now
    });
  }, []);
  
  /**
   * Stop performance tracking
   * Finalizes metrics and stops measuring
   */
  const stopPerformanceTracking = useCallback(() => {
    metricsRef.current.tracking = false;
    
    // Calculate final metrics
    updateMetrics();
  }, []);
  
  /**
   * Record a frame for performance tracking
   * Called on each animation frame to measure timing
   */
  const recordFrame = useCallback(() => {
    if (!metricsRef.current.tracking) return;
    
    const now = performance.now();
    const frameDuration = now - metricsRef.current.lastFrameTime;
    
    // Track frame stats
    metricsRef.current.frames++;
    metricsRef.current.totalFrameTime += frameDuration;
    metricsRef.current.lastFrameTime = now;
    
    // Check for dropped frames (over 16.67ms = 60fps threshold)
    if (frameDuration > 16.67) {
      metricsRef.current.droppedFrames++;
      
      // Count long frames (over 33.33ms = 30fps threshold)
      if (frameDuration > 33.33) {
        metricsRef.current.longFrames++;
      }
    }
    
    // Track max frame time
    metricsRef.current.maxFrameTime = Math.max(
      metricsRef.current.maxFrameTime,
      frameDuration
    );
    
    // Update metrics every 30 frames
    if (metricsRef.current.frames % 30 === 0) {
      updateMetrics();
    }
  }, []);
  
  /**
   * Update performance metrics based on collected data
   * Calculates aggregate metrics like FPS and average frame time
   */
  const updateMetrics = useCallback(() => {
    const metrics = metricsRef.current;
    
    if (metrics.frames === 0) return;
    
    const elapsedTime = performance.now() - metrics.startTime;
    const fps = Math.round((metrics.frames * 1000) / elapsedTime);
    const avgFrameTime = metrics.totalFrameTime / metrics.frames;
    
    setPerformanceMetrics({
      fps,
      frameTime: avgFrameTime,
      droppedFrames: metrics.droppedFrames,
      maxFrameTime: metrics.maxFrameTime,
      longFrames: metrics.longFrames,
      measuredSince: metrics.startTime
    });
  }, []);
  
  /**
   * Reset performance metrics to default state
   */
  const resetPerformanceMetrics = useCallback(() => {
    metricsRef.current = {
      frames: 0,
      startTime: 0,
      lastFrameTime: 0,
      totalFrameTime: 0,
      droppedFrames: 0,
      maxFrameTime: 0,
      longFrames: 0,
      tracking: false
    };
    
    setPerformanceMetrics(DEFAULT_METRICS);
  }, []);
  
  return {
    performanceMetrics,
    startPerformanceTracking,
    stopPerformanceTracking,
    recordFrame,
    updateMetrics,
    resetPerformanceMetrics
  };
};
