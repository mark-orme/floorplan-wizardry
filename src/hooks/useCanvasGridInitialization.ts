
/**
 * Custom hook for reliable canvas grid initialization
 * Ensures grid is created only after canvas is fully initialized
 * @module useCanvasGridInitialization
 */
import { useRef, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { dumpGridState, attemptGridRecovery, forceCreateGrid } from '@/utils/grid/gridDebugUtils';
import { toast } from 'sonner';
import { DebugInfoState } from '@/types/drawingTypes';
import { MAX_GRID_CREATION_ATTEMPTS } from '@/constants/canvas';

// Define constants locally if they don't exist
const MAX_ATTEMPTS = MAX_GRID_CREATION_ATTEMPTS || 3;
const GRID_CREATION_DELAY = 100; // ms

interface UseCanvasGridInitializationProps {
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  setHasError?: (value: boolean) => void;
  setErrorMessage?: (value: string) => void;
}

/**
 * Hook for reliable canvas grid initialization
 * Includes methods to create, verify, and recover grid
 * 
 * @param props Hook configuration
 * @returns Grid layer reference and initialization methods
 */
export const useCanvasGridInitialization = ({
  setDebugInfo,
  setHasError = () => {},
  setErrorMessage = () => {}
}: UseCanvasGridInitializationProps) => {
  // Create a reference to hold grid objects
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // Track initialization attempts 
  const initAttemptRef = useRef(0);
  const initTimeoutRef = useRef<number | null>(null);
  
  /**
   * Create grid on canvas with retry mechanism
   * @param canvas The fabric canvas
   * @param createGridFn Custom grid creation function
   * @returns Created grid objects or empty array if failed
   */
  const initializeGrid = useCallback((
    canvas: FabricCanvas | null, 
    createGridFn?: (canvas: FabricCanvas) => FabricObject[]
  ): FabricObject[] => {
    // Reset attempts counter when explicitly called
    initAttemptRef.current = 0;
    
    // Clear any existing timeouts
    if (initTimeoutRef.current !== null) {
      window.clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }
    
    if (!canvas) {
      console.error("Cannot initialize grid: Canvas is null");
      setDebugInfo(prev => ({ ...prev, gridCreated: false }));
      return [];
    }
    
    const attemptGridCreation = () => {
      console.log(`Grid creation attempt ${initAttemptRef.current + 1}/${MAX_ATTEMPTS}`);
      
      if (!canvas) {
        console.error("Canvas became null during grid creation attempts");
        setDebugInfo(prev => ({ ...prev, gridCreated: false }));
        return [];
      }
      
      // Clear any existing grid
      if (gridLayerRef.current.length > 0) {
        gridLayerRef.current.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
        gridLayerRef.current = [];
      }
      
      try {
        // Check if the canvas has valid dimensions
        const width = canvas.getWidth?.() || canvas.width;
        const height = canvas.getHeight?.() || canvas.height;
        
        if (!width || !height || width <= 0 || height <= 0) {
          console.error(`Canvas has invalid dimensions: ${width}x${height}`);
          
          // Try again if we haven't reached max attempts
          if (initAttemptRef.current < MAX_ATTEMPTS - 1) {
            initAttemptRef.current++;
            initTimeoutRef.current = window.setTimeout(attemptGridCreation, GRID_CREATION_DELAY * initAttemptRef.current);
            return [];
          } else {
            // Last attempt, try force grid creation
            console.warn("Using emergency grid creation due to invalid dimensions");
            const grid = forceCreateGrid(canvas, gridLayerRef);
            return grid ? gridLayerRef.current : [];
          }
        }
        
        // Try to create the grid with the provided function first
        let gridObjects: FabricObject[] = [];
        
        if (typeof createGridFn === 'function') {
          try {
            console.log("Creating grid with provided creation function");
            gridObjects = createGridFn(canvas);
          } catch (error) {
            console.error("Error using provided grid creation function:", error);
          }
        }
        
        // If that failed, use the recovery function
        if (!gridObjects || gridObjects.length === 0) {
          console.log("Primary grid creation failed, attempting recovery");
          const recoverySuccess = attemptGridRecovery(canvas, gridLayerRef, createGridFn || null);
          
          if (recoverySuccess) {
            gridObjects = gridLayerRef.current;
          } else {
            // If recovery failed and we have attempts left, try again
            if (initAttemptRef.current < MAX_ATTEMPTS - 1) {
              initAttemptRef.current++;
              initTimeoutRef.current = window.setTimeout(attemptGridCreation, GRID_CREATION_DELAY * initAttemptRef.current);
              return [];
            } else {
              // Last resort - force grid creation
              console.warn("Recovery failed, using force grid creation");
              forceCreateGrid(canvas, gridLayerRef);
              gridObjects = gridLayerRef.current;
            }
          }
        } else {
          // Store successfully created grid objects
          gridLayerRef.current = gridObjects;
        }
        
        // Update debug info
        setDebugInfo(prev => ({ 
          ...prev, 
          gridCreated: gridObjects.length > 0,
          lastGridCreationTime: Date.now()
        }));
        
        // If we've created grid objects, log and return them
        if (gridObjects.length > 0) {
          console.log(`Grid initialization successful: Created ${gridObjects.length} objects`);
          dumpGridState(canvas, gridLayerRef);
          return gridObjects;
        } else {
          // If we still have no grid objects after all attempts
          console.error("All grid creation attempts failed");
          setHasError(true);
          setErrorMessage("Failed to create grid after multiple attempts");
          setDebugInfo(prev => ({ ...prev, gridCreated: false }));
          return [];
        }
      } catch (error) {
        console.error("Error during grid initialization:", error);
        
        // Try again if we haven't reached max attempts
        if (initAttemptRef.current < MAX_ATTEMPTS - 1) {
          initAttemptRef.current++;
          initTimeoutRef.current = window.setTimeout(attemptGridCreation, GRID_CREATION_DELAY * initAttemptRef.current);
          return [];
        } else {
          // Last attempt failed
          setHasError(true);
          setErrorMessage("Grid initialization failed due to an error");
          setDebugInfo(prev => ({ ...prev, gridCreated: false }));
          return [];
        }
      }
    };
    
    // Start the grid creation process
    return attemptGridCreation();
  }, [setDebugInfo, setHasError, setErrorMessage]);
  
  /**
   * Check if grid exists and is properly attached to canvas
   * @param canvas The fabric canvas
   * @returns Whether grid exists and is valid
   */
  const checkGridHealth = useCallback((canvas: FabricCanvas | null): boolean => {
    if (!canvas) {
      console.warn("Cannot check grid health: Canvas is null");
      return false;
    }
    
    const gridExists = gridLayerRef.current.length > 0;
    const gridOnCanvas = gridLayerRef.current.filter(obj => canvas.contains(obj)).length;
    const gridHealthy = gridExists && gridOnCanvas >= gridLayerRef.current.length * 0.75;
    
    return gridHealthy;
  }, []);
  
  /**
   * Force create grid with multiple recovery strategies
   * Used when button is clicked in debug overlay
   * @returns Created grid objects
   */
  const forceGridCreation = useCallback((): FabricObject[] => {
    // Reset attempt counter
    initAttemptRef.current = 0;
    
    // Find existing fabric canvas instance
    // First try to find the canvas element
    const canvasElement = document.querySelector('canvas') as HTMLCanvasElement | null;
    
    if (!canvasElement) {
      console.error("Cannot force create grid: Canvas element not found in DOM");
      toast.error("Canvas element not found");
      return [];
    }
    
    // Try to get the Fabric.js canvas instance
    // Method 1: Look for a registered Fabric canvas instance
    let fabricCanvas: FabricCanvas | null = null;
    
    try {
      // Try to access Fabric.js instance from global registry if available
      if (window.fabricCanvasInstances) {
        fabricCanvas = window.fabricCanvasInstances[0] || null;
      }
    } catch (error) {
      console.warn("Could not get fabric canvas from registry:", error);
    }
    
    // Method 2: Try to access via custom property (needs type definition)
    if (!fabricCanvas && canvasElement._fabric) {
      try {
        fabricCanvas = canvasElement._fabric as unknown as FabricCanvas;
      } catch (error) {
        console.warn("Could not get _fabric property from canvas element:", error);
      }
    }
    
    // Final fallback: try to create a new Fabric.js canvas
    if (!fabricCanvas) {
      console.error("Could not find existing Fabric canvas instance");
      toast.error("Fabric canvas not available");
      return [];
    }
    
    console.log("Force grid creation requested by user");
    
    try {
      forceCreateGrid(fabricCanvas, gridLayerRef);
      
      // Dump grid state for debugging
      dumpGridState(fabricCanvas, gridLayerRef);
      
      // Update debug info
      setDebugInfo(prev => ({ 
        ...prev, 
        gridCreated: gridLayerRef.current.length > 0,
        lastGridCreationTime: Date.now()
      }));
      
      return gridLayerRef.current;
    } catch (error) {
      console.error("Force grid creation failed with error:", error);
      toast.error("Grid creation failed");
      return [];
    }
  }, [setDebugInfo]);
  
  return {
    gridLayerRef,
    initializeGrid,
    checkGridHealth,
    forceGridCreation
  };
};
