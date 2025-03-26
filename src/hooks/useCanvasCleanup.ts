
/**
 * Custom hook for proper canvas cleanup
 * @module useCanvasCleanup
 */
import { useCallback, useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { disposeCanvas, isCanvasValid } from "@/utils/fabricCanvas";
import logger from "@/utils/logger";

// Global state management for canvas cleanup
const cleanupState = {
  // Flag to track if canvas disposal is in progress globally
  disposalInProgress: false,
  // Track recently disposed canvases to prevent dispose/recreate loops
  recentlyDisposedCanvases: new Set<number>(),
  // Track consecutive disposal attempts to detect loops
  consecutiveDisposals: 0,
  // Maximum allowed consecutive disposals before loop detection
  MAX_CONSECUTIVE_DISPOSALS: 2,
  // Cooldown period for disposals (ms)
  DISPOSAL_COOLDOWN_MS: 5000,
  // Track current disposal timeout
  currentTimeoutId: null as number | null,
  // Track canvas instances being disposed to prevent double disposal
  disposingCanvases: new WeakSet<FabricCanvas>(),
  // Track canvas elements that have been initialized to prevent multiple initializations
  initializedCanvasElements: new WeakMap<HTMLCanvasElement, boolean>(),
  // Flag to track if we're detecting a loop
  loopDetected: false,
  // Time when the last loop was detected
  lastLoopDetectedTime: 0
};

/**
 * Hook to handle proper cleanup of canvas resources
 */
export const useCanvasCleanup = () => {
  // Local references to track state within this hook instance
  const isCleaningUpRef = useRef(false);
  const mountTimeRef = useRef(Date.now());
  const disposeTimeoutsRef = useRef<number[]>([]);

  // Clean up any lingering timeouts when unmounting
  useEffect(() => {
    return () => {
      // Clear all timeouts created by this hook instance
      disposeTimeoutsRef.current.forEach(timeoutId => {
        window.clearTimeout(timeoutId);
      });
      disposeTimeoutsRef.current = [];
      
      // Reset the cleanup state if it's been a while since mount
      // This helps recover from stuck states
      if (Date.now() - mountTimeRef.current > 10000) {
        cleanupState.disposalInProgress = false;
        cleanupState.consecutiveDisposals = 0;
      }
    };
  }, []);

  /**
   * Check if we're in a cleanup loop
   */
  const isInCleanupLoop = useCallback((): boolean => {
    // If we've already detected a loop recently, return true
    if (cleanupState.loopDetected) {
      // Check if enough time has passed to reset loop detection
      const now = Date.now();
      if (now - cleanupState.lastLoopDetectedTime > 10000) {
        // Reset loop detection after 10 seconds
        cleanupState.loopDetected = false;
        logger.info("Reset canvas cleanup loop detection state");
        return false;
      }
      return true;
    }
    
    // Detect a loop if we have too many consecutive disposals
    if (cleanupState.consecutiveDisposals > cleanupState.MAX_CONSECUTIVE_DISPOSALS) {
      cleanupState.loopDetected = true;
      cleanupState.lastLoopDetectedTime = Date.now();
      logger.warn("Canvas cleanup loop detected");
      return true;
    }
    
    return false;
  }, []);

  /**
   * Properly dispose of canvas resources
   */
  const cleanupCanvas = useCallback((fabricCanvas: FabricCanvas | null) => {
    if (!fabricCanvas) {
      logger.debug("No canvas to clean up - already null");
      return;
    }
    
    // Don't dispose the same canvas twice
    if (cleanupState.disposingCanvases.has(fabricCanvas)) {
      logger.debug("This canvas is already being disposed, skipping");
      return;
    }
    
    // Check if we're in a disposal loop
    if (isInCleanupLoop()) {
      logger.warn("Too many canvas disposals in short time, possible loop detected");
      console.warn("CANVAS CLEANUP: Possible disposal loop detected, skipping cleanup");
      return;
    }
    
    // Generate a unique identifier for this canvas instance
    const canvasId = Date.now();
    
    // Increment the consecutive disposals counter
    cleanupState.consecutiveDisposals++;
    
    // Check if we're in a disposal cooldown period to prevent loops
    if (cleanupState.recentlyDisposedCanvases.size > 2) {
      logger.warn("Too many recent canvas disposals, possible loop detected");
      console.warn("CANVAS CLEANUP: Too many recent disposals, skipping cleanup");
      return;
    }
    
    // Prevent concurrent disposals
    if (cleanupState.disposalInProgress) {
      logger.debug("Canvas disposal already in progress, skipping");
      return;
    }
    
    // Set local cleaning flag to true
    isCleaningUpRef.current = true;
    
    // Mark this canvas as being disposed
    cleanupState.disposingCanvases.add(fabricCanvas);
    
    // Set global disposal in progress flag
    cleanupState.disposalInProgress = true;
    
    try {
      // Before disposing, check if the canvas is valid
      if (!isCanvasValid(fabricCanvas)) {
        logger.debug("Canvas instance appears to be invalid or already disposed");
        
        // Reset flags
        cleanupState.disposalInProgress = false;
        isCleaningUpRef.current = false;
        cleanupState.disposingCanvases.delete(fabricCanvas);
        return;
      }
      
      // Track this disposal to detect loops
      cleanupState.recentlyDisposedCanvases.add(canvasId);
      
      // Clear tracked disposals after cooldown period
      const cooldownTimeoutId = window.setTimeout(() => {
        cleanupState.recentlyDisposedCanvases.delete(canvasId);
        // Also decrease consecutive disposals count after cooldown
        if (cleanupState.consecutiveDisposals > 0) {
          cleanupState.consecutiveDisposals--;
        }
      }, cleanupState.DISPOSAL_COOLDOWN_MS);
      
      disposeTimeoutsRef.current.push(cooldownTimeoutId);
      
      // Mark canvas element as not initialized anymore
      try {
        const canvasElement = fabricCanvas.getElement();
        if (canvasElement) {
          cleanupState.initializedCanvasElements.delete(canvasElement);
          logger.debug("Canvas element marked as not initialized");
        }
      } catch (error) {
        logger.error("Error accessing canvas element during cleanup:", error);
      }
      
      // Add a timeout to ensure we're not in the middle of a render cycle
      // This helps prevent React errors during disposal
      const disposeTimeoutId = window.setTimeout(() => {
        try {
          // Add additional check to ensure canvas is still valid right before disposal
          if (fabricCanvas && isCanvasValid(fabricCanvas) && !fabricCanvas.disposed) {
            disposeCanvas(fabricCanvas);
            logger.info("Canvas disposed successfully");
          }
        } catch (error) {
          logger.error("Error during delayed canvas cleanup:", error);
        } finally {
          // Always reset the flags
          cleanupState.disposalInProgress = false;
          isCleaningUpRef.current = false;
          cleanupState.disposingCanvases.delete(fabricCanvas);
        }
      }, 250);
      
      disposeTimeoutsRef.current.push(disposeTimeoutId);
    } catch (error) {
      logger.error("Error during canvas cleanup:", error);
      cleanupState.disposalInProgress = false;
      isCleaningUpRef.current = false;
      cleanupState.disposingCanvases.delete(fabricCanvas);
    }
  }, [isInCleanupLoop]);

  /**
   * Check if a canvas element has already been initialized
   */
  const isCanvasElementInitialized = useCallback((element: HTMLCanvasElement | null): boolean => {
    if (!element) return false;
    
    // Check in our WeakMap if this element has been initialized
    return cleanupState.initializedCanvasElements.has(element);
  }, []);

  /**
   * Mark a canvas element as initialized
   */
  const markCanvasAsInitialized = useCallback((element: HTMLCanvasElement | null): void => {
    if (!element) return;
    cleanupState.initializedCanvasElements.set(element, true);
    logger.debug("Canvas element marked as initialized");
  }, []);

  /**
   * Reset canvas cleanup state (useful for recovering from stuck states)
   */
  const resetCleanupState = useCallback((): void => {
    cleanupState.disposalInProgress = false;
    cleanupState.consecutiveDisposals = 0;
    cleanupState.recentlyDisposedCanvases.clear();
    cleanupState.disposingCanvases = new WeakSet<FabricCanvas>();
    cleanupState.loopDetected = false;
    logger.debug("Canvas cleanup state has been reset");
  }, []);

  return {
    cleanupCanvas,
    isCanvasElementInitialized,
    markCanvasAsInitialized,
    resetCleanupState,
    isCleaningUp: isCleaningUpRef.current
  };
};
