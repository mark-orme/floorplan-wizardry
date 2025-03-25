
/**
 * Custom hook for handling canvas event registration and cleanup
 * @module useCanvasEventHandlers
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Path as FabricPath, Object as FabricObject } from "fabric";
import { DrawingTool } from "./useCanvasState";
import logger from "@/utils/logger";

/**
 * Props for the useCanvasEventHandlers hook
 * @interface UseCanvasEventHandlersProps
 */
interface UseCanvasEventHandlersProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Current line color */
  lineColor: string;
  /** Current line thickness */
  lineThickness: number;
  /** Function to save current state before making changes */
  saveCurrentState: () => void;
  /** Function to handle undo operation */
  handleUndo: () => void;
  /** Function to handle redo operation */
  handleRedo: () => void;
  /** Function to handle mouse down event */
  handleMouseDown: (e: any) => void;
  /** Function to handle mouse move event */
  handleMouseMove: (e: any) => void;
  /** Function to handle mouse up event */
  handleMouseUp: () => void;
  /** Function to process created path */
  processCreatedPath: (path: FabricPath) => void;
  /** Function to clean up timeouts */
  cleanupTimeouts: () => void;
  /** Function to delete selected objects */
  deleteSelectedObjects: () => void;
}

/**
 * Return type for useCanvasEventHandlers hook
 * @interface UseCanvasEventHandlersResult
 */
interface UseCanvasEventHandlersResult {
  /** Register zoom change tracking */
  registerZoomTracking: () => (() => void) | undefined;
}

/**
 * Hook that handles canvas event registration and cleanup
 * Manages all event listeners for the canvas
 * @param {UseCanvasEventHandlersProps} props - Hook properties
 * @returns {UseCanvasEventHandlersResult} Event handling utilities
 */
export const useCanvasEventHandlers = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness,
  saveCurrentState,
  handleUndo,
  handleRedo,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  processCreatedPath,
  cleanupTimeouts,
  deleteSelectedObjects
}: UseCanvasEventHandlersProps): UseCanvasEventHandlersResult => {
  
  // Set up all event handlers
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      fabricCanvas.freeDrawingBrush.color = lineColor;
    }
    
    /**
     * Handle path created event
     * @param {Object} e - Event object containing the created path
     */
    const handlePathCreated = (e: {path: FabricPath}): void => {
      logger.info("Path created event triggered");
      
      // IMPORTANT: Save current state BEFORE making any changes
      // This ensures we can properly undo to previous state
      saveCurrentState();
      
      // Process the path based on the current tool
      processCreatedPath(e.path);
      handleMouseUp();
    };
    
    /**
     * Handle object modified event
     */
    const handleObjectModified = () => {
      // Save state when objects are modified
      logger.info("Object modified, saving state");
      saveCurrentState();
    };
    
    /**
     * Handle object removed event
     */
    const handleObjectRemoved = () => {
      // Save state when objects are removed
      logger.info("Object removed, saving state");
      saveCurrentState();
    };
    
    /**
     * Handle keyboard event for delete key
     * @param {KeyboardEvent} e - Keyboard event
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only delete if in select mode
        if (tool === 'select') {
          deleteSelectedObjects();
        }
      }
    };
    
    /**
     * Handle double-click to enter edit mode for walls
     * @param {Object} e - Double click event object
     */
    const handleDoubleClick = (e: { target: FabricObject | null }) => {
      if (tool === 'select' && e.target) {
        const target = e.target as FabricObject & { objectType?: string; isEditing?: boolean; type?: string };
        if (target.type === 'polyline' || target.objectType === 'line') {
          // Mark the object as being edited
          target.isEditing = true;
          
          // Save current state before editing
          saveCurrentState();
          
          // Allow for the wall to be redrawn
          fabricCanvas.discardActiveObject();
          fabricCanvas.setActiveObject(e.target);
          fabricCanvas.requestRenderAll();
        }
      }
    };
    
    fabricCanvas.on('path:created', handlePathCreated);
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    fabricCanvas.on('object:modified', handleObjectModified);
    fabricCanvas.on('object:removed', handleObjectRemoved);
    fabricCanvas.on('mouse:dblclick', handleDoubleClick);
    
    // Add keyboard event listeners
    window.addEventListener('keydown', handleKeyDown);
    
    // Expose undo/redo handlers to the global canvas object for debugging
    // This helps with external access from CanvasController
    (fabricCanvas as any).handleUndo = handleUndo;
    (fabricCanvas as any).handleRedo = handleRedo;
    (fabricCanvas as any).saveCurrentState = saveCurrentState;
    (fabricCanvas as any).deleteSelectedObjects = deleteSelectedObjects;
    
    return () => {
      cleanupTimeouts();
      
      if (fabricCanvas) {
        fabricCanvas.off('path:created', handlePathCreated);
        fabricCanvas.off('mouse:down', handleMouseDown);
        fabricCanvas.off('mouse:move', handleMouseMove);
        fabricCanvas.off('mouse:up', handleMouseUp);
        fabricCanvas.off('object:modified', handleObjectModified);
        fabricCanvas.off('object:removed', handleObjectRemoved);
        fabricCanvas.off('mouse:dblclick', handleDoubleClick);
        
        // Clean up custom handlers
        delete (fabricCanvas as any).handleUndo;
        delete (fabricCanvas as any).handleRedo;
        delete (fabricCanvas as any).saveCurrentState;
        delete (fabricCanvas as any).deleteSelectedObjects;
      }
      
      // Remove keyboard event listeners
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    fabricCanvasRef, 
    processCreatedPath, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp,
    cleanupTimeouts,
    tool,
    lineThickness,
    lineColor,
    saveCurrentState,
    handleUndo,
    handleRedo,
    deleteSelectedObjects
  ]);

  /**
   * Register zoom change tracking
   * Sets up event listeners for zoom changes
   * @returns {Function} Cleanup function
   */
  const registerZoomTracking = useCallback(() => {
    const updateZoomLevel = () => {
      if (fabricCanvasRef.current) {
        const zoom = fabricCanvasRef.current.getZoom();
        fabricCanvasRef.current.fire('custom:zoom-changed', { zoom });
      }
    };
    
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      fabricCanvas.on('zoom:changed' as any, updateZoomLevel);
      
      return () => {
        fabricCanvas.off('zoom:changed' as any, updateZoomLevel);
      };
    }
    
    return undefined;
  }, [fabricCanvasRef]);

  return {
    registerZoomTracking
  };
};
