
/**
 * Hook for reliable grid initialization
 * Handles creating and maintaining grid with fallback mechanisms
 * @module useReliableGridInitialization
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { 
  createCompleteGrid,
  createBasicEmergencyGrid as emergencyCreate, 
  validateGrid,
  ensureGrid 
} from "@/utils/gridCreationUtils";
import logger from "@/utils/logger";
import { toast } from "sonner";

/**
 * Grid initialization constants
 * Controls timing and retry behavior for grid creation
 */
const GRID_INITIALIZATION = {
  /**
   * Delay between grid creation retry attempts in ms
   * Prevents excessive retries and allows time for canvas to settle
   * @constant {number}
   */
  RETRY_DELAY: 500,
  
  /**
   * Maximum number of grid initialization attempts
   * Prevents infinite retry loops if grid creation fails repeatedly
   * @constant {number}
   */
  MAX_ATTEMPTS: 3,
  
  /**
   * Initial delay before first grid creation attempt in ms
   * Allows canvas to fully initialize before adding grid
   * @constant {number}
   */
  INITIAL_DELAY: 200,
  
  /**
   * Delay multiplier for subsequent retries
   * Increases delay for each retry attempt
   * @constant {number}
   */
  RETRY_DELAY_MULTIPLIER: 1.5
};

/**
 * Hook for reliable grid initialization with retries and fallback
 * 
 * @param {React.MutableRefObject<FabricCanvas | null>} fabricCanvasRef - Reference to Fabric canvas
 * @returns {Object} Grid management utilities
 */
export const useReliableGridInitialization = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>
) => {
  // Reference to grid objects
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // Track grid initialization state
  const [isGridInitialized, setIsGridInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const attemptCountRef = useRef(0);
  const lastAttemptTimeRef = useRef(0);
  
  /**
   * Initialize the grid with retry mechanism
   * Handles all grid creation scenarios with proper fallbacks
   */
  const initializeGrid = useCallback(() => {
    // Don't initialize if canvas is missing
    if (!fabricCanvasRef.current) {
      logger.warn("Cannot initialize grid: Canvas is null");
      return;
    }
    
    // Don't retry too frequently
    const now = Date.now();
    if (now - lastAttemptTimeRef.current < GRID_INITIALIZATION.RETRY_DELAY) {
      logger.debug("Grid initialization throttled");
      return;
    }
    
    // Don't retry if already initializing
    if (isInitializing) {
      logger.debug("Grid initialization already in progress");
      return;
    }
    
    // Don't retry if we've exceeded max attempts
    if (attemptCountRef.current >= GRID_INITIALIZATION.MAX_ATTEMPTS) {
      logger.warn(`Max grid initialization attempts (${GRID_INITIALIZATION.MAX_ATTEMPTS}) reached`);
      return;
    }
    
    // Set initializing state
    setIsInitializing(true);
    lastAttemptTimeRef.current = now;
    attemptCountRef.current++;
    
    logger.info(`Grid initialization attempt ${attemptCountRef.current}/${GRID_INITIALIZATION.MAX_ATTEMPTS}`);
    console.log(`🔄 Grid initialization attempt ${attemptCountRef.current}/${GRID_INITIALIZATION.MAX_ATTEMPTS}`);
    
    try {
      const canvas = fabricCanvasRef.current;
      
      // Check if canvas has valid dimensions
      if (!canvas.width || !canvas.height || canvas.width === 0 || canvas.height === 0) {
        logger.error("Grid initialization failed: Canvas has zero dimensions");
        console.error("❌ Grid initialization failed: Canvas has zero dimensions");
        
        setIsInitializing(false);
        
        // Try again after delay if we haven't exceeded max attempts
        if (attemptCountRef.current < GRID_INITIALIZATION.MAX_ATTEMPTS) {
          const retryDelay = GRID_INITIALIZATION.RETRY_DELAY * 
            Math.pow(GRID_INITIALIZATION.RETRY_DELAY_MULTIPLIER, attemptCountRef.current - 1);
            
          setTimeout(initializeGrid, retryDelay);
        }
        
        return;
      }
      
      // Try to create a complete grid
      let gridObjects: FabricObject[] = [];
      
      try {
        gridObjects = createCompleteGrid(canvas, gridLayerRef);
      } catch (error) {
        logger.error("Error creating complete grid:", error);
        console.error("❌ Error creating complete grid:", error);
        
        // Try emergency grid as fallback
        try {
          gridObjects = emergencyCreate(canvas, gridLayerRef);
        } catch (emergencyError) {
          logger.error("Emergency grid creation also failed:", emergencyError);
          console.error("❌ Emergency grid creation also failed:", emergencyError);
        }
      }
      
      // Check if grid was created successfully
      if (Array.isArray(gridObjects) && gridObjects.length > 0) {
        logger.info(`Grid initialized with ${gridObjects.length} objects`);
        console.log(`✅ Grid initialized with ${gridObjects.length} objects`);
        
        // Update state
        setIsGridInitialized(true);
        setIsInitializing(false);
        
        // Force render to make sure grid is visible
        canvas.requestRenderAll();
      } else {
        logger.error("Grid initialization failed: No objects created");
        console.error("❌ Grid initialization failed: No objects created");
        
        setIsInitializing(false);
        
        // Try again after delay if we haven't exceeded max attempts
        if (attemptCountRef.current < GRID_INITIALIZATION.MAX_ATTEMPTS) {
          const retryDelay = GRID_INITIALIZATION.RETRY_DELAY * 
            Math.pow(GRID_INITIALIZATION.RETRY_DELAY_MULTIPLIER, attemptCountRef.current - 1);
            
          setTimeout(initializeGrid, retryDelay);
        } else {
          // Show error toast on final failure
          toast.error("Grid initialization failed after multiple attempts");
        }
      }
    } catch (error) {
      logger.error("Unexpected error during grid initialization:", error);
      console.error("❌ Unexpected error during grid initialization:", error);
      
      setIsInitializing(false);
      
      // Try again after delay if we haven't exceeded max attempts
      if (attemptCountRef.current < GRID_INITIALIZATION.MAX_ATTEMPTS) {
        const retryDelay = GRID_INITIALIZATION.RETRY_DELAY * 
          Math.pow(GRID_INITIALIZATION.RETRY_DELAY_MULTIPLIER, attemptCountRef.current - 1);
          
        setTimeout(initializeGrid, retryDelay);
      } else {
        // Show error toast on final failure
        toast.error("Grid initialization failed due to an error");
      }
    }
  }, [fabricCanvasRef, isInitializing]);
  
  /**
   * Force grid recreation
   * Used when user explicitly requests grid recreation
   */
  const forceGridRecreation = useCallback(() => {
    // Reset attempt counter
    attemptCountRef.current = 0;
    
    // Initialize with highest priority
    initializeGrid();
  }, [initializeGrid]);
  
  /**
   * Check grid health and fix if needed
   * Used for periodic grid health checks
   */
  const checkAndFixGrid = useCallback((): boolean => {
    if (!fabricCanvasRef.current) {
      return false;
    }
    
    return ensureGrid(fabricCanvasRef.current, gridLayerRef);
  }, [fabricCanvasRef]);
  
  /**
   * Get current grid status for debugging
   */
  const getGridStatus = useCallback(() => {
    return {
      initialized: isGridInitialized,
      initializing: isInitializing,
      objects: gridLayerRef.current.length,
      attempts: attemptCountRef.current,
      lastAttempt: lastAttemptTimeRef.current
    };
  }, [isGridInitialized, isInitializing]);
  
  // Initialize grid when canvas is available
  useEffect(() => {
    if (fabricCanvasRef.current && !isGridInitialized && !isInitializing) {
      // Give canvas a moment to fully initialize before creating grid
      const timer = setTimeout(() => {
        initializeGrid();
      }, GRID_INITIALIZATION.INITIAL_DELAY);
      
      return () => clearTimeout(timer);
    }
  }, [fabricCanvasRef, isGridInitialized, isInitializing, initializeGrid]);
  
  // Cleanup grid when component unmounts
  useEffect(() => {
    return () => {
      // Remove grid objects from canvas if canvas ref is still valid
      if (fabricCanvasRef.current) {
        gridLayerRef.current.forEach(obj => {
          if (fabricCanvasRef.current?.contains(obj)) {
            fabricCanvasRef.current.remove(obj);
          }
        });
      }
      
      // Clear grid layer reference
      gridLayerRef.current = [];
    };
  }, [fabricCanvasRef]);
  
  return {
    gridLayerRef,
    isGridInitialized,
    isInitializing,
    initializeGrid,
    forceGridRecreation,
    checkAndFixGrid,
    getGridStatus
  };
};

