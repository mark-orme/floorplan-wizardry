
/**
 * Custom hook for handling canvas interaction options
 * Provides selection, deletion, and interaction modes for canvas objects
 * @module useCanvasInteraction
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { DrawingTool } from "./useCanvasState";
import { enableSelection, disableSelection } from "@/utils/fabricInteraction";
import logger from "@/utils/logger";

/**
 * Props for the useCanvasInteraction hook
 * @interface UseCanvasInteractionProps
 */
interface UseCanvasInteractionProps {
  /** Reference to the fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Function to save current canvas state before making changes */
  saveCurrentState: () => void;
}

/**
 * Return type for the useCanvasInteraction hook
 * @interface UseCanvasInteractionResult
 */
interface UseCanvasInteractionResult {
  /** Deletes all currently selected objects on the canvas */
  deleteSelectedObjects: () => void;
  /** Enables point-based selection mode (vs lasso selection) */
  enablePointSelection: () => void;
  /** Sets up appropriate selection mode based on current tool */
  setupSelectionMode: () => void;
}

/**
 * Type definition for enhanced fabric objects with selection properties
 */
interface SelectableFabricObject {
  /** Type identifier for specialized handling */
  objectType?: string;
  /** Whether the object is selectable */
  selectable: boolean;
  /** Whether the object responds to events */
  evented?: boolean;
  /** Cursor to show when hovering over the object */
  hoverCursor?: string;
  /** Line stroke width */
  strokeWidth?: number;
  /** Whether to use per-pixel target finding */
  perPixelTargetFind?: boolean;
  /** Tolerance for target finding */
  targetFindTolerance?: number;
  /** Object type from Fabric */
  type: string;
}

/**
 * Hook that provides canvas interaction options and object selection capabilities
 * @param {UseCanvasInteractionProps} props - Hook properties
 * @returns {UseCanvasInteractionResult} Canvas interaction functions
 */
export const useCanvasInteraction = ({
  fabricCanvasRef,
  tool,
  saveCurrentState
}: UseCanvasInteractionProps): UseCanvasInteractionResult => {
  
  /**
   * Delete the currently selected object(s) on the canvas
   */
  const deleteSelectedObjects = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    
    if (activeObjects.length === 0) {
      toast.info("No objects selected. Select an object to delete.");
      return;
    }
    
    // Save current state before deletion for proper undo
    saveCurrentState();
    
    // Remove all selected objects
    activeObjects.forEach(obj => {
      // Skip grid elements
      const objectType = (obj as unknown as SelectableFabricObject).objectType;
      if (objectType && objectType.includes('grid')) {
        return;
      }
      canvas.remove(obj);
    });
    
    // Clear selection and render
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    
    toast.success(`Deleted ${activeObjects.length} object(s)`);
  }, [fabricCanvasRef, saveCurrentState]);
  
  /**
   * Enable point-based selection mode (instead of lasso)
   * Makes objects individually selectable with better hit detection
   */
  const enablePointSelection = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Enable selection but disable group selection (lasso)
    canvas.selection = false; // Disable drag-to-select (lasso)
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'pointer';
    
    // Make objects selectable
    canvas.getObjects().forEach(obj => {
      const fabricObj = obj as unknown as SelectableFabricObject;
      // Skip grid elements
      const objectType = fabricObj.objectType;
      if (!objectType || !objectType.includes('grid')) {
        fabricObj.selectable = true;
        fabricObj.hoverCursor = 'pointer';
        
        // Ensure lines and polylines are selectable
        const isLineType = obj.type === 'polyline' || obj.type === 'line' || objectType === 'line';
        if (isLineType) {
          fabricObj.selectable = true;
          fabricObj.evented = true;
          fabricObj.hoverCursor = 'pointer';
          
          // Increase hit box for easier selection
          fabricObj.strokeWidth = Math.max(fabricObj.strokeWidth || 2, 2);
          fabricObj.perPixelTargetFind = false;
          fabricObj.targetFindTolerance = 10;
        }
      }
    });
    
    canvas.requestRenderAll();
    logger.info("Point selection mode enabled");
  }, [fabricCanvasRef]);
  
  /**
   * Setup selection mode based on current tool
   * Enables or disables object selection based on the active tool
   */
  const setupSelectionMode = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    if (tool === "select") {
      logger.info("Setting up selection mode for tool:", tool);
      enablePointSelection();
    } else {
      disableSelection(fabricCanvasRef.current);
    }
  }, [fabricCanvasRef, tool, enablePointSelection]);
  
  // Apply selection mode immediately when tool changes
  useEffect(() => {
    if (tool === "select") {
      logger.info("Selection tool active - setting up selection mode");
      enablePointSelection();
    }
  }, [tool, enablePointSelection]);
  
  return {
    deleteSelectedObjects,
    enablePointSelection,
    setupSelectionMode
  };
};
