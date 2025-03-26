
/**
 * Hook for tracking frame performance metrics
 * @module useFrameMetrics
 */
import { useState, useRef, useCallback } from "react";
import { type PerformanceMetrics } from "@/types/performanceTypes";

/**
 * Hook for tracking frame rate and dropped frames
 * @returns Frame metrics tracking state and functions
 */
export const useFrameMetrics = () => {
  // Performance metrics tracking
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    droppedFrames: 0,
    frameTime: 0,
    maxFrameTime: 0,
    longFrames: 0,
    measuredSince: new Date()
  });
  
  // References for performance tracking
  const framesRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());
  const frameTimesRef = useRef<number[]>([]);
  const longFramesRef = useRef(0);
  const trackingStartTimeRef = useRef(performance.now());
  const isTrackingRef = useRef(false);
  
  // Target frame rate and budget
  const targetFps = 60;
  const frameBudget = 1000 / targetFps; // ~16.67ms for 60fps

  /**
   * Start tracking frame performance
   */
  const startPerformanceTracking = useCallback(() => {
    // Reset tracking metrics
    framesRef.current = 0;
    frameTimesRef.current = [];
    longFramesRef.current = 0;
    trackingStartTimeRef.current = performance.now();
    lastFrameTimeRef.current = performance.now();
    isTrackingRef.current = true;
    
    // Update measurement start time
    setPerformanceMetrics(prev => ({
      ...prev,
      measuredSince: new Date()
    }));
    
    console.log("Performance tracking started");
  }, []);
  
  /**
   * Stop tracking frame performance
   */
  const stopPerformanceTracking = useCallback(() => {
    isTrackingRef.current = false;
    console.log("Performance tracking stopped");
  }, []);
  
  /**
   * Calculate and update performance metrics
   */
  const updateMetrics = useCallback(() => {
    const now = performance.now();
    const totalTime = now - trackingStartTimeRef.current;
    const frameTimes = frameTimesRef.current;
    
    if (frameTimes.length === 0) return;
    
    // Calculate metrics
    const fps = framesRef.current / (totalTime / 1000);
    const avgFrameTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
    const maxFrameTime = Math.max(...frameTimes);
    
    // Estimate dropped frames based on expected frames vs actual frames
    const expectedFrames = (totalTime / 1000) * targetFps;
    const droppedFrames = Math.max(0, Math.round(expectedFrames - framesRef.current));
    
    // Update state
    setPerformanceMetrics({
      fps: Math.round(fps * 10) / 10, // Round to 1 decimal place
      droppedFrames,
      frameTime: Math.round(avgFrameTime * 100) / 100, // Round to 2 decimal places
      maxFrameTime: Math.round(maxFrameTime * 100) / 100,
      longFrames: longFramesRef.current,
      measuredSince: new Date(trackingStartTimeRef.current)
    });
  }, []);
  
  /**
   * Record a frame in the performance tracking
   */
  const recordFrame = useCallback(() => {
    if (!isTrackingRef.current) return;
    
    const now = performance.now();
    const frameTime = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;
    
    // Record frame time
    frameTimesRef.current.push(frameTime);
    framesRef.current++;
    
    // Check if frame exceeds budget (dropped frame)
    if (frameTime > frameBudget * 1.5) {
      longFramesRef.current++;
    }
    
    // Limit the number of samples to avoid memory growth
    if (frameTimesRef.current.length > 300) {
      frameTimesRef.current.shift();
    }
    
    // Update metrics every 30 frames
    if (framesRef.current % 30 === 0) {
      updateMetrics();
    }
  }, [updateMetrics]);

  /**
   * Reset performance metrics
   */
  const resetPerformanceMetrics = useCallback(() => {
    setPerformanceMetrics({
      fps: 0,
      droppedFrames: 0,
      frameTime: 0,
      maxFrameTime: 0,
      longFrames: 0,
      measuredSince: new Date()
    });
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
