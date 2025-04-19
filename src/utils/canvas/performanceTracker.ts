/**
 * Utility for tracking canvas performance
 * @module utils/canvas/performanceTracker
 */
import { PerformanceStats } from "@/types/drawingTypes";

let frameCount = 0;
let lastFpsUpdateTime = 0;
let fps = 0;
let droppedFrames = 0;
let frameTimes: number[] = [];
let lastFrameTime = 0;

/**
 * Reset performance tracking statistics
 */
export const resetPerformanceStats = (): void => {
  frameCount = 0;
  lastFpsUpdateTime = 0;
  fps = 0;
  droppedFrames = 0;
  frameTimes = [];
  lastFrameTime = 0;
};

/**
 * Track a frame render for performance
 * @returns {void}
 */
export const trackFrameRender = (): void => {
  const now = performance.now();
  frameCount++;
  
  // Calculate frame time
  if (lastFrameTime > 0) {
    const frameTime = now - lastFrameTime;
    frameTimes.push(frameTime);
    
    // Keep only the last 60 frame times
    if (frameTimes.length > 60) {
      frameTimes.shift();
    }
    
    // Detect dropped frames (frames taking more than 32ms are considered dropped)
    if (frameTime > 32) {
      droppedFrames++;
    }
  }
  
  lastFrameTime = now;
  
  // Update FPS once per second
  if (now - lastFpsUpdateTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (now - lastFpsUpdateTime));
    frameCount = 0;
    lastFpsUpdateTime = now;
  }
};

/**
 * Get current performance statistics
 * @returns {PerformanceStats} Current performance statistics
 */
export const getPerformanceStats = (): PerformanceStats => {
  // Calculate average frame time
  let avgFrameTime = 0;
  let maxFrameTime = 0;
  let longFrames = 0;
  
  if (frameTimes.length > 0) {
    avgFrameTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
    maxFrameTime = Math.max(...frameTimes);
    longFrames = frameTimes.filter(time => time > 16).length;
  }
  
  return {
    fps,
    renderTime: Math.round(avgFrameTime * 100) / 100,
    objectCount: 0,
    lastUpdate: Date.now()
  };
};

/**
 * Measure execution time of a function
 * @param {Function} fn Function to measure
 * @param {string} name Name for logging
 * @returns {any} Result of the function
 */
export const measureExecutionTime = <T>(fn: () => T, name: string): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`[Performance] ${name}: ${Math.round((end - start) * 100) / 100}ms`);
  return result;
};

/**
 * Create a throttled version of a function
 * @param {Function} fn Function to throttle
 * @param {number} delay Delay in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(fn: T, delay: number): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>): void => {
    const now = performance.now();
    if (now - lastCall < delay) return;
    
    lastCall = now;
    fn(...args);
  };
};

/**
 * Create a debounced version of a function
 * @param {Function} fn Function to debounce
 * @param {number} delay Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null;
  
  return (...args: Parameters<T>): void => {
    if (timeout !== null) {
      window.clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
