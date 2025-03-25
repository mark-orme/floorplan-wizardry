
/**
 * Hook for grid validation operations
 * Validates grid components and state
 * @module useGridValidation
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DebugInfoState } from "@/types/drawingTypes";
import { toast } from "sonner";

/**
 * Props for the useGridValidation hook
 * @interface UseGridValidationProps
 */
interface UseGridValidationProps {
  /** Setter for debug information state */
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
}

/**
 * Hook for grid validation operations
 * @param {UseGridValidationProps} props - Hook properties
 * @returns {Object} Grid validation utilities
 */
export const useGridValidation = ({
  setDebugInfo
}: UseGridValidationProps) => {
  /**
   * Validate that all required grid components are available
   * @param {FabricCanvas} canvas - The Fabric.js canvas instance
   * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to the grid layer
   * @returns {boolean} Whether the grid components are valid
   */
  const validateGridComponents = useCallback((
    canvas: FabricCanvas | null, 
    gridLayerRef: React.MutableRefObject<FabricObject[]>
  ): boolean => {
    // Check if canvas exists
    if (!canvas) {
      setDebugInfo(prev => ({
        ...prev,
        gridState: 'invalid',
        lastGridOperation: 'Validation failed: Canvas is null'
      }));
      return false;
    }
    
    // Check if gridLayerRef is initialized
    if (!gridLayerRef) {
      setDebugInfo(prev => ({
        ...prev,
        gridState: 'invalid',
        lastGridOperation: 'Validation failed: gridLayerRef is null'
      }));
      return false;
    }
    
    return true;
  }, [setDebugInfo]);
  
  /**
   * Ensure grid layer is initialized
   * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to the grid layer
   * @returns {FabricObject[]} The initialized grid layer
   */
  const ensureGridLayerInitialized = useCallback((
    gridLayerRef: React.MutableRefObject<FabricObject[]>
  ): FabricObject[] => {
    if (!gridLayerRef.current) {
      gridLayerRef.current = [];
      setDebugInfo(prev => ({
        ...prev,
        gridState: 'initialized',
        lastGridOperation: 'Grid layer initialized'
      }));
    }
    
    return gridLayerRef.current;
  }, [setDebugInfo]);
  
  /**
   * Validate canvas dimensions for grid creation
   * @param {{ width: number, height: number }} dimensions - Canvas dimensions
   * @returns {boolean} Whether dimensions are valid
   */
  const validateDimensions = useCallback((dimensions: { width: number, height: number }): boolean => {
    if (!dimensions || typeof dimensions.width !== 'number' || typeof dimensions.height !== 'number') {
      toast.error("Invalid canvas dimensions");
      return false;
    }
    
    if (dimensions.width <= 0 || dimensions.height <= 0) {
      toast.error("Canvas dimensions must be positive");
      return false;
    }
    
    return true;
  }, []);
  
  return {
    validateGridComponents,
    ensureGridLayerInitialized,
    validateDimensions
  };
};
