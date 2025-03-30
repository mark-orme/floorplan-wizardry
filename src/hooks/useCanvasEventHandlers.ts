
/**
 * Custom hook for handling canvas event registration and cleanup
 * Centralizes all event handler management for canvas operations
 * @module useCanvasEventHandlers
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Path as FabricPath, Object as FabricObject } from "fabric";
import { DrawingTool } from "@/types/drawingTypes";
import logger from "@/utils/logger";

// Import types and event hooks
import { EventHandlerResult } from "./canvas-events/types";
import { usePathEvents } from "./canvas-events/usePathEvents";
import { useObjectEvents } from "./canvas-events/useObjectEvents";
import { useZoomTracking } from "./canvas-events/useZoomTracking";
import { useBrushSettings } from "./canvas-events/useBrushSettings";

/**
 * Props for the useCanvasEventHandlers hook
 * @interface UseCanvasEventHandlersProps
 */
export interface UseCanvasEventHandlersProps {
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
  /** Function to update zoom level */
  updateZoomLevel: () => void;
}

/**
 * Return type for useCanvasEventHandlers hook
 * @interface UseCanvasEventHandlersResult
 */
interface UseCanvasEventHandlersResult {
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
  deleteSelectedObjects,
  updateZoomLevel
}: UseCanvasEventHandlersProps): UseCanvasEventHandlersResult => {
  
  // Register mouse event handlers directly
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    console.log("Registering direct canvas event handlers for tool:", tool);
    
    const onCanvasMouseDown = (e: any) => {
      const nativeEvent = e.e as MouseEvent | TouchEvent;
      handleMouseDown(nativeEvent);
    };
    
    const onCanvasMouseMove = (e: any) => {
      const nativeEvent = e.e as MouseEvent | TouchEvent;
      handleMouseMove(nativeEvent);
    };
    
    const onCanvasMouseUp = (e: any) => {
      const nativeEvent = e.e as MouseEvent | TouchEvent;
      handleMouseUp(nativeEvent);
    };
    
    // Register handlers
    canvas.on('mouse:down', onCanvasMouseDown);
    canvas.on('mouse:move', onCanvasMouseMove);
    canvas.on('mouse:up', onCanvasMouseUp);
    
    // Update brush settings
    canvas.freeDrawingBrush.color = lineColor;
    canvas.freeDrawingBrush.width = lineThickness;
    
    // Set drawing mode based on tool
    canvas.isDrawingMode = tool === DrawingTool.DRAW;
    
    return () => {
      // Unregister handlers
      canvas.off('mouse:down', onCanvasMouseDown);
      canvas.off('mouse:move', onCanvasMouseMove);
      canvas.off('mouse:up', onCanvasMouseUp);
    };
  }, [
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  ]);
  
  // Set up all individual event handlers using the dedicated hooks
  
  // Handle path creation events
  const { cleanup: cleanupPathEvents } = usePathEvents?.({
    fabricCanvasRef,
    tool,
    saveCurrentState,
    processCreatedPath,
    handleMouseUp
  }) || { cleanup: () => {} };
  
  // Handle object modification and removal events
  const { cleanup: cleanupObjectEvents } = useObjectEvents?.({
    fabricCanvasRef,
    tool,
    saveCurrentState
  }) || { cleanup: () => {} };
  
  // Handle brush settings
  const { cleanup: cleanupBrushSettings } = useBrushSettings?.({
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness
  }) || { cleanup: () => {} };
  
  // Handle zoom tracking
  const { cleanup: cleanupZoomTracking } = useZoomTracking?.({
    fabricCanvasRef,
    tool,
    updateZoomLevel
  }) || { cleanup: () => {} };
  
  // Cleanup function to remove all event handlers
  const cleanupAllEventHandlers = useCallback(() => {
    logger.info("Cleaning up all canvas event handlers");
    
    if (cleanupPathEvents) cleanupPathEvents();
    if (cleanupObjectEvents) cleanupObjectEvents();
    if (cleanupBrushSettings) cleanupBrushSettings();
    if (cleanupZoomTracking) cleanupZoomTracking();
    
    // Also clean up any timeouts
    cleanupTimeouts();
  }, [
    cleanupPathEvents,
    cleanupObjectEvents,
    cleanupBrushSettings,
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
    cleanupAllEventHandlers
  };
};
