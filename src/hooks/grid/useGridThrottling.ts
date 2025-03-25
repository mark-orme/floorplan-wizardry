
/**
 * Hook for managing grid creation throttling
 * Prevents excessive grid recreations under certain conditions
 * @module useGridThrottling
 */
import { useRef, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { gridManager, resetGridProgress } from "@/utils/gridManager";
import { toast } from "sonner";

interface UseGridThrottlingProps {
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<any[]>;
}

/**
 * Hook for grid throttling operations
 * @param props - Hook properties
 * @returns Throttling utilities
 */
export const useGridThrottling = ({
  gridLayerRef
}: UseGridThrottlingProps) => {
  // Track grid creation timeouts
  const creationTimeoutRef = useRef<number | null>(null);
  
  /**
   * Check if grid creation should be throttled
   * @returns Whether to throttle grid creation
   */
  const shouldThrottleCreation = useCallback((): boolean => {
    return gridManager.consecutiveResets >= gridManager.maxConsecutiveResets - 1;
  }, []);
  
  /**
   * Handle throttled grid creation
   * @param canvas - The Fabric.js canvas instance
   * @param createGridFn - Grid creation function to call when throttling expires
   * @returns Current grid objects
   */
  const handleThrottledCreation = useCallback((
    canvas: FabricCanvas,
    createGridFn: (canvas: FabricCanvas) => any[]
  ): any[] => {
    if (process.env.NODE_ENV === 'development') {
      console.warn("Throttling grid creation due to too many resets");
    }
    
    // Clear any existing timeout
    if (creationTimeoutRef.current !== null) {
      clearTimeout(creationTimeoutRef.current);
    }
    
    // Schedule delayed creation
    creationTimeoutRef.current = window.setTimeout(() => {
      if (!canvas) return;
      
      // Only try again if reset counter has been reduced
      if (gridManager.consecutiveResets < gridManager.maxConsecutiveResets) {
        resetGridProgress();
        createGridFn(canvas);
      } else {
        toast.error("Grid creation is temporarily paused. Please wait a moment.", {
          id: "grid-throttled",
          duration: 3000
        });
      }
    }, 2000);
    
    return gridLayerRef.current;
  }, [gridLayerRef]);
  
  /**
   * Clean up any pending timeouts
   */
  const cleanup = useCallback(() => {
    if (creationTimeoutRef.current !== null) {
      clearTimeout(creationTimeoutRef.current);
      creationTimeoutRef.current = null;
    }
  }, []);
  
  return {
    shouldThrottleCreation,
    handleThrottledCreation,
    cleanup
  };
};
