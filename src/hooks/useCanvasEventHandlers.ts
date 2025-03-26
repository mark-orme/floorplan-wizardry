
/**
 * Custom hook for handling canvas event registration and cleanup
 * @module useCanvasEventHandlers
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Path as FabricPath, Object as FabricObject } from "fabric";
import { DrawingTool } from "./useCanvasState";
import logger from "@/utils/logger";
import {
  usePathEvents,
  useObjectEvents,
  useMouseEvents,
  useKeyboardEvents,
  useZoomTracking,
  useBrushSettings,
  useCanvasHandlers
} from "./canvas-events";

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
  
  // Set up all individual event handlers using the dedicated hooks
  
  // Handle path creation events
  usePathEvents({
    fabricCanvasRef,
    tool,
    saveCurrentState,
    processCreatedPath,
    handleMouseUp
  });
  
  // Handle object modification and removal events
  useObjectEvents({
    fabricCanvasRef,
    tool,
    saveCurrentState
  });
  
  // Handle mouse events
  useMouseEvents({
    fabricCanvasRef,
    tool,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    saveCurrentState
  });
  
  // Handle keyboard events
  useKeyboardEvents({
    fabricCanvasRef,
    tool,
    deleteSelectedObjects
  });
  
  // Handle brush settings
  useBrushSettings({
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness
  });
  
  // Register global canvas handlers
  useCanvasHandlers({
    fabricCanvasRef,
    tool,
    handleUndo,
    handleRedo,
    saveCurrentState,
    deleteSelectedObjects
  });
  
  // Clean up timeouts when unmounting
  useCallback(() => {
    cleanupTimeouts();
  }, [cleanupTimeouts]);
  
  // Get the zoom tracking function from its dedicated hook
  const { registerZoomTracking } = useZoomTracking({
    fabricCanvasRef
  });

  return {
    registerZoomTracking
  };
};
