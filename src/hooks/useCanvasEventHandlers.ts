
/**
 * Custom hook for handling canvas event registration and cleanup
 * Centralizes all event handler management for canvas operations
 * @module useCanvasEventHandlers
 */
import { useCallback, useEffect } from "react";
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
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  /** Function to handle mouse move event */
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  /** Function to handle mouse up event */
  handleMouseUp: (e?: MouseEvent | TouchEvent) => void;
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
  /** Cleanup all event handlers */
  cleanupAllEventHandlers: () => void;
}

/**
 * Hook that handles canvas event registration and cleanup
 * Manages all event listeners for the canvas
 * 
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
  const { cleanup: cleanupPathEvents } = usePathEvents({
    fabricCanvasRef,
    tool,
    saveCurrentState,
    processCreatedPath,
    handleMouseUp
  });
  
  // Handle object modification and removal events
  const { cleanup: cleanupObjectEvents } = useObjectEvents({
    fabricCanvasRef,
    tool,
    saveCurrentState
  });
  
  // Handle mouse events
  const { cleanup: cleanupMouseEvents } = useMouseEvents({
    fabricCanvasRef,
    tool,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    saveCurrentState
  });
  
  // Handle keyboard events
  const { cleanup: cleanupKeyboardEvents } = useKeyboardEvents({
    fabricCanvasRef,
    tool,
    handleUndo,
    handleRedo,
    deleteSelectedObjects
  });
  
  // Handle brush settings
  const { cleanup: cleanupBrushSettings } = useBrushSettings({
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness
  });
  
  // Register global canvas handlers
  const { cleanup: cleanupCanvasHandlers } = useCanvasHandlers({
    fabricCanvasRef,
    tool,
    handleUndo,
    handleRedo,
    saveCurrentState,
    deleteSelectedObjects
  });
  
  // Get the zoom tracking function from its dedicated hook
  const { registerZoomTracking, cleanup: cleanupZoomTracking } = useZoomTracking({
    fabricCanvasRef
  });

  // Cleanup function to remove all event handlers
  const cleanupAllEventHandlers = useCallback(() => {
    logger.info("Cleaning up all canvas event handlers");
    
    if (cleanupPathEvents) cleanupPathEvents();
    if (cleanupObjectEvents) cleanupObjectEvents();
    if (cleanupMouseEvents) cleanupMouseEvents();
    if (cleanupKeyboardEvents) cleanupKeyboardEvents();
    if (cleanupBrushSettings) cleanupBrushSettings();
    if (cleanupCanvasHandlers) cleanupCanvasHandlers();
    if (cleanupZoomTracking) cleanupZoomTracking();
    
    // Also clean up any timeouts
    cleanupTimeouts();
  }, [
    cleanupPathEvents,
    cleanupObjectEvents,
    cleanupMouseEvents,
    cleanupKeyboardEvents, 
    cleanupBrushSettings,
    cleanupCanvasHandlers,
    cleanupZoomTracking,
    cleanupTimeouts
  ]);
  
  // Ensure all handlers are cleaned up when the component unmounts
  useEffect(() => {
    return () => {
      cleanupAllEventHandlers();
    };
  }, [cleanupAllEventHandlers]);

  return {
    registerZoomTracking,
    cleanupAllEventHandlers
  };
};
