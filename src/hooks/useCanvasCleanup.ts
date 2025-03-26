
/**
 * Custom hook for canvas cleanup operations
 * Provides utilities for safely disposing canvas instances
 * @module useCanvasCleanup
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { disposeCanvas, isCanvasDisposed, forceCleanCanvasElement, isCanvasElementInitialized } from "@/utils/fabricCanvas";
import logger from "@/utils/logger";

// Track canvas disposals to prevent loops
const canvasDisposalTracker = {
  disposedCanvases: new WeakSet<FabricCanvas>(),
  disposalAttempts: 0,
  maxDisposalAttempts: 3,
  initializedElements: new WeakMap<HTMLCanvasElement, boolean>(),
  lastDisposalTime: 0,
  // Add a counter to track initialization attempts
  initializationAttempts: 0,
  maxInitializationAttempts: 5,
  // Add a reset timer
  lastResetTime: 0,
  resetIntervalMs: 60000, // 1 minute reset interval
};

/**
 * Hook that provides canvas cleanup utilities
 * @returns Cleanup functions for canvas instances and elements
 */
export const useCanvasCleanup = () => {
  const disposalInProgressRef = useRef(false);
  
  /**
   * Reset canvas initialization attempts counter
   * Should be called when we want to allow a fresh set of attempts
   */
  const resetInitializationAttempts = useCallback(() => {
    const now = Date.now();
    
    // Only allow reset if it's been at least X time since last reset
    if (now - canvasDisposalTracker.lastResetTime > canvasDisposalTracker.resetIntervalMs) {
      logger.info("Resetting canvas initialization attempts counter");
      canvasDisposalTracker.initializationAttempts = 0;
      canvasDisposalTracker.lastResetTime = now;
      return true;
    } else {
      logger.info(`Cannot reset initialization attempts yet. Wait ${Math.ceil((canvasDisposalTracker.resetIntervalMs - (now - canvasDisposalTracker.lastResetTime)) / 1000)} seconds more.`);
      return false;
    }
  }, []);
  
  /**
   * Track canvas initialization attempt
   * @returns Whether initialization is allowed
   */
  const trackInitializationAttempt = useCallback((): boolean => {
    // Auto-reset if it's been a while since last reset
    const now = Date.now();
    if (now - canvasDisposalTracker.lastResetTime > canvasDisposalTracker.resetIntervalMs) {
      resetInitializationAttempts();
    }
    
    // Increment counter
    canvasDisposalTracker.initializationAttempts++;
    
    // Check if we've exceeded max attempts
    if (canvasDisposalTracker.initializationAttempts > canvasDisposalTracker.maxInitializationAttempts) {
      logger.error(`Too many canvas initialization attempts (${canvasDisposalTracker.initializationAttempts}), blocking further attempts`);
      return false;
    }
    
    return true;
  }, [resetInitializationAttempts]);
  
  /**
   * Safely clean up a canvas instance
   * @param {FabricCanvas} canvas - The canvas to clean up
   * @returns {boolean} Whether cleanup was successful
   */
  const cleanupCanvas = useCallback((canvas: FabricCanvas | null): boolean => {
    if (!canvas) {
      return false;
    }
    
    // Skip if already disposed or if cleanup is in progress
    if (disposalInProgressRef.current) {
      logger.warn("Canvas cleanup already in progress, skipping");
      return false;
    }
    
    // Skip if already disposed
    if (isCanvasDisposed(canvas) || canvasDisposalTracker.disposedCanvases.has(canvas)) {
      logger.info("Canvas already disposed, skipping cleanup");
      return true;
    }
    
    // Check for disposal loop
    canvasDisposalTracker.disposalAttempts++;
    const now = Date.now();
    const timeSinceLastDisposal = now - canvasDisposalTracker.lastDisposalTime;
    
    // If we've tried to dispose too many canvases in a short time, prevent disposal loop
    if (canvasDisposalTracker.disposalAttempts > canvasDisposalTracker.maxDisposalAttempts && 
        timeSinceLastDisposal < 5000) {
      logger.warn("CANVAS CLEANUP: Possible disposal loop detected, skipping cleanup");
      return false;
    }
    
    // Set flag to prevent concurrent disposal
    disposalInProgressRef.current = true;
    
    try {
      // Track this canvas as disposed
      canvasDisposalTracker.disposedCanvases.add(canvas);
      canvasDisposalTracker.lastDisposalTime = now;
      
      // Actually dispose the canvas
      disposeCanvas(canvas);
      
      logger.info("Canvas disposed successfully");
      return true;
    } catch (error) {
      logger.error("Error disposing canvas:", error);
      return false;
    } finally {
      // Reset flag
      disposalInProgressRef.current = false;
    }
  }, []);
  
  /**
   * Check if a canvas element is already initialized with Fabric
   * @param {HTMLCanvasElement} element - Canvas element to check
   * @returns {boolean} Whether the element is initialized
   */
  const isCanvasElementInitialized = useCallback((element: HTMLCanvasElement): boolean => {
    if (!element) return false;
    
    // Check our tracker first
    if (canvasDisposalTracker.initializedElements.has(element)) {
      return true;
    }
    
    // Then use utility function
    return isCanvasElementInitialized(element);
  }, []);
  
  /**
   * Mark a canvas element as initialized
   * @param {HTMLCanvasElement} element - Canvas element to mark
   */
  const markCanvasAsInitialized = useCallback((element: HTMLCanvasElement): void => {
    if (!element) return;
    canvasDisposalTracker.initializedElements.set(element, true);
  }, []);
  
  /**
   * Cleanup a canvas HTML element
   * @param {HTMLCanvasElement} element - Canvas element to clean
   * @returns {boolean} Whether cleanup was successful
   */
  const forceCleanCanvasElement = useCallback((element: HTMLCanvasElement): boolean => {
    if (!element) return false;
    
    // Remove from our tracker
    canvasDisposalTracker.initializedElements.delete(element);
    
    // Then use utility function
    return forceCleanCanvasElement(element);
  }, []);
  
  return {
    cleanupCanvas,
    isCanvasElementInitialized,
    markCanvasAsInitialized,
    forceCleanCanvasElement,
    trackInitializationAttempt,
    resetInitializationAttempts,
    // Export for debugging
    getInitializationAttempts: () => canvasDisposalTracker.initializationAttempts,
    getMaxInitializationAttempts: () => canvasDisposalTracker.maxInitializationAttempts
  };
};
