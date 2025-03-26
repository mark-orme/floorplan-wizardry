
/**
 * Custom hook for proper canvas cleanup
 * @module useCanvasCleanup
 */
import { useCallback, useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { disposeCanvas, isCanvasValid } from "@/utils/fabricCanvas";
import logger from "@/utils/logger";
import { hardResetCanvasElement } from "@/utils/gridCreationUtils";

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
  lastLoopDetectedTime: 0,
  // Track all canvas elements to ensure they are properly handled
  canvasElementRegistry: new WeakMap<HTMLCanvasElement, {
    initialized: boolean,
    timestamp: number,
    fabricIds: string[]
  }>(),
  // Completely block initializations after detecting severe loops
  blockAllInitializations: false,
  // Counter for consecutive initialization attempts
  initializationAttempts: 0,
  // Maximum allowed initialization attempts before blocking
  MAX_INITIALIZATION_ATTEMPTS: 5
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
    // If all initializations are blocked, return true immediately
    if (cleanupState.blockAllInitializations) {
      logger.warn("All canvas initializations are blocked due to severe loop detection");
      return true;
    }
    
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
   * Force clean a canvas element by removing Fabric data attributes
   */
  const forceCleanCanvasElement = useCallback((element: HTMLCanvasElement | null): boolean => {
    if (!element) return false;
    
    try {
      // If we've detected a severe loop, perform a hard reset
      if (cleanupState.loopDetected && 
          cleanupState.consecutiveDisposals > cleanupState.MAX_CONSECUTIVE_DISPOSALS + 2) {
        return hardResetCanvasElement(element);
      }
      
      // Remove all data attributes that Fabric uses to track initialization
      element.removeAttribute('data-fabric');
      element.removeAttribute('data-fabric-initialized');
      
      // Also remove inline width/height to allow reinitializing with new dimensions
      element.style.width = '';
      element.style.height = '';
      
      // Clean internal registry
      cleanupState.initializedCanvasElements.delete(element);
      cleanupState.canvasElementRegistry.delete(element);
      
      logger.debug("Canvas element forcibly cleaned");
      return true;
    } catch (error) {
      logger.error("Error during forced canvas element cleanup:", error);
      return false;
    }
  }, []);

  /**
   * Track initialization attempts and block if too many occur
   */
  const trackInitializationAttempt = useCallback((): boolean => {
    // Check if initializations are blocked
    if (cleanupState.blockAllInitializations) {
      logger.warn("Canvas initialization blocked - too many attempts");
      return false;
    }
    
    // Increment attempt counter
    cleanupState.initializationAttempts++;
    
    // Check if we've reached the limit
    if (cleanupState.initializationAttempts >= cleanupState.MAX_INITIALIZATION_ATTEMPTS) {
      logger.error(`Too many canvas initialization attempts (${cleanupState.initializationAttempts}), blocking further attempts`);
      cleanupState.blockAllInitializations = true;
      
      // Schedule a reset after a delay to recover
      setTimeout(() => {
        logger.info("Resetting canvas initialization block after timeout");
        cleanupState.blockAllInitializations = false;
        cleanupState.initializationAttempts = 0;
      }, 10000); // 10-second timeout
      
      return false;
    }
    
    return true;
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
      
      // Try to get canvas element before disposal
      let canvasElement: HTMLCanvasElement | null = null;
      try {
        canvasElement = fabricCanvas.getElement();
      } catch (e) {
        logger.debug("Could not get canvas element during cleanup");
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
      if (canvasElement) {
        cleanupState.initializedCanvasElements.delete(canvasElement);
        logger.debug("Canvas element marked as not initialized");
        
        // Force clean the element to prevent reinitialization issues
        forceCleanCanvasElement(canvasElement);
      }
      
      // Add a timeout to ensure we're not in the middle of a render cycle
      // This helps prevent React errors during disposal
      const disposeTimeoutId = window.setTimeout(() => {
        try {
          // Add additional check to ensure canvas is still valid right before disposal
          if (fabricCanvas && isCanvasValid(fabricCanvas) && !fabricCanvas.disposed) {
            disposeCanvas(fabricCanvas);
            logger.info("Canvas disposed successfully");
            
            // Force clean the element after disposal
            if (canvasElement) {
              forceCleanCanvasElement(canvasElement);
            }
          }
        } catch (error) {
          logger.error("Error during delayed canvas cleanup:", error);
          
          // Force clean the element even after error
          if (canvasElement) {
            forceCleanCanvasElement(canvasElement);
          }
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
  }, [isInCleanupLoop, forceCleanCanvasElement]);

  /**
   * Check if a canvas element has already been initialized
   */
  const isCanvasElementInitialized = useCallback((element: HTMLCanvasElement | null): boolean => {
    if (!element) return false;
    
    // Check if the element has a data-fabric attribute
    const hasFabricAttribute = element.hasAttribute('data-fabric');
    
    // Check in our WeakMap if this element has been initialized
    const isTrackedAsInitialized = cleanupState.initializedCanvasElements.has(element);
    
    return hasFabricAttribute || isTrackedAsInitialized;
  }, []);

  /**
   * Mark a canvas element as initialized
   */
  const markCanvasAsInitialized = useCallback((element: HTMLCanvasElement | null): void => {
    if (!element) return;
    
    // Track the initialization attempt
    if (!trackInitializationAttempt()) {
      return;
    }
    
    cleanupState.initializedCanvasElements.set(element, true);
    
    // Also update our registry
    cleanupState.canvasElementRegistry.set(element, {
      initialized: true,
      timestamp: Date.now(),
      fabricIds: Array.from(element.attributes)
        .filter(attr => attr.name.startsWith('data-'))
        .map(attr => attr.name)
    });
    
    logger.debug("Canvas element marked as initialized");
  }, [trackInitializationAttempt]);

  /**
   * Reset canvas cleanup state (useful for recovering from stuck states)
   */
  const resetCleanupState = useCallback((): void => {
    cleanupState.disposalInProgress = false;
    cleanupState.consecutiveDisposals = 0;
    cleanupState.recentlyDisposedCanvases.clear();
    cleanupState.disposingCanvases = new WeakSet<FabricCanvas>();
    cleanupState.loopDetected = false;
    cleanupState.blockAllInitializations = false;
    cleanupState.initializationAttempts = 0;
    logger.debug("Canvas cleanup state has been reset");
  }, []);

  return {
    cleanupCanvas,
    isCanvasElementInitialized,
    markCanvasAsInitialized,
    forceCleanCanvasElement,
    resetCleanupState,
    isCleaningUp: isCleaningUpRef.current,
    isInitializationBlocked: cleanupState.blockAllInitializations
  };
};
