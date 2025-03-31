
/**
 * Custom hook for handling canvas interactions
 * Manages zooming, panning, and keyboard shortcuts
 * @module useCanvasInteractions
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Point } from "fabric";
import { useCanvasState } from "./useCanvasState";
import { useZoom } from "./useZoom";
import { ZoomOptions } from "@/types/zoomTypes";
import { Point as CorePoint } from "@/types/core/Point";
import { createPoint } from "@/types/core/Point";
import { DrawingState } from "@/types/core/DrawingState";

/**
 * Interface for the return value of the useCanvasInteractions hook.
 * @interface UseCanvasInteractionsResult
 */
interface UseCanvasInteractionsResult {
  /**
   * Function to reset the viewport transform of the canvas.
   */
  resetViewport: () => void;
  /**
   * Current drawing state
   */
  drawingState?: DrawingState;
  /**
   * Current zoom level
   */
  currentZoom: number;
  /**
   * Toggle grid snapping
   */
  toggleSnap: () => void;
  /**
   * Whether snapping is enabled
   */
  snapEnabled: boolean;
}

// Extend fabric Canvas with our custom properties
interface ExtendedCanvas extends FabricCanvas {
  isPanning?: boolean;
  lastPanPosition?: CorePoint | null;
}

/**
 * Hook that provides canvas interaction options and object selection capabilities
 * @param {UseCanvasInteractionProps} props - Hook properties
 * @returns {UseCanvasInteractionResult} Canvas interaction functions
 */
export const useCanvasInteractions = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  tool: string,
  lineThickness: number,
  lineColor: string
): UseCanvasInteractionsResult => {
  const { tool: stateTool } = useCanvasState();
  const { updateZoomState, currentZoom } = useZoom();
  const [snapEnabled, setSnapEnabled] = useState(true);
  
  /**
   * Toggle snap to grid functionality
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Resets the viewport transform of the canvas to its initial state.
   */
  const resetViewport = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.renderAll();
  }, [fabricCanvasRef]);
  
  /**
   * Handles zoom events on the canvas.
   * @param {any} e - The event object.
   */
  const handleZoom = useCallback((e: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const event = e.e;
    
    // Prevent default behavior to avoid browser zoom
    if (event.preventDefault) {
      event.preventDefault();
    }
    
    // Get the zoom point in canvas coordinates
    const pointer = canvas.getPointer(event);
    
    // Determine zoom direction from the event
    let deltaY;
    
    if (event.deltaY !== undefined) {
      deltaY = event.deltaY;
    } else if (event.wheelDelta !== undefined) {
      // Convert wheelDelta to deltaY (they go in opposite directions)
      deltaY = -event.wheelDelta;
    } else {
      // Default if no delta information is available
      deltaY = 0;
    }
    
    // Calculate new zoom level
    // Make sure we're working with numbers for the arithmetic operations
    const currentZoom = Number(canvas.getZoom() || 1);
    const zoomDelta = Number(deltaY < 0 ? 0.05 : -0.05); // Invert for natural scrolling
    const newZoom = Math.max(0.5, Math.min(5, currentZoom + zoomDelta));
    
    // Apply zoom to the canvas
    canvas.zoomToPoint(new Point(pointer.x, pointer.y), newZoom);
    
    // Update zoom level in state
    updateZoomState(newZoom);
    
    // Re-render the canvas
    canvas.requestRenderAll();
  }, [fabricCanvasRef, updateZoomState]);
  
  /**
   * Handles panning the canvas.
   * @param {any} event - The event object.
   */
  const handlePan = useCallback((event: any) => {
    const canvas = fabricCanvasRef.current as ExtendedCanvas | null;
    if (!canvas || tool !== "pan") return;
    
    // Set panning to true on mouse down
    canvas.isPanning = true;
    
    // Get the pointer coordinates
    const { x, y } = canvas.getPointer(event.e);
    
    // Store the initial coordinates as a Point
    canvas.lastPanPosition = createPoint(x, y);
  }, [fabricCanvasRef, tool]);
  
  /**
   * Handles mouse move events for panning.
   * @param {any} event - The event object.
   */
  const handlePanMove = useCallback((event: any) => {
    const canvas = fabricCanvasRef.current as ExtendedCanvas | null;
    if (!canvas || tool !== "pan" || !canvas.isPanning || !canvas.lastPanPosition) return;
    
    // Get the pointer coordinates
    const { x, y } = canvas.getPointer(event.e);
    
    // Calculate delta
    const deltaX = (typeof x === 'number' && typeof canvas.lastPanPosition.x === 'number') ? x - canvas.lastPanPosition.x : 0;
    const deltaY = (typeof y === 'number' && typeof canvas.lastPanPosition.y === 'number') ? y - canvas.lastPanPosition.y : 0;
    
    // Update the viewport transform
    // Use fabric's relativePan method with a proper FabricPoint object
    canvas.relativePan(new Point(deltaX, deltaY));
    
    // Update the last pan position
    canvas.lastPanPosition = createPoint(x, y);
  }, [fabricCanvasRef, tool]);
  
  /**
   * Handles mouse up events for panning.
   */
  const handlePanEnd = useCallback(() => {
    const canvas = fabricCanvasRef.current as ExtendedCanvas | null;
    if (!canvas) return;
    
    // Set panning to false on mouse up
    canvas.isPanning = false;
    canvas.lastPanPosition = null;
  }, [fabricCanvasRef]);
  
  /**
   * Handles keyboard shortcuts.
   * @param {KeyboardEvent} e - The keyboard event.
   */
  const handleShortcut = useCallback((e: KeyboardEvent) => {
    // Check for Ctrl/Cmd + Z for Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault(); // Prevent browser's default undo
      //handleUndo(); // Call the undo function
    }
    
    // Check for Ctrl/Cmd + Shift + Z for Redo
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
      e.preventDefault(); // Prevent browser's default redo
      //handleRedo(); // Call the redo function
    }
  }, []);
  
  /**
   * Registers event listeners for zoom and pan.
   */
  const registerZoomEvents = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Use string event names directly rather than enum values
    canvas.on('mouse:wheel', handleZoom);
    
    return () => {
      if (canvas) {
        canvas.off('mouse:wheel', handleZoom);
      }
    };
  }, [fabricCanvasRef, handleZoom]);
  
  /**
   * Registers event listeners for pan.
   */
  const registerPanEvents = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.on('mouse:down', handlePan);
    canvas.on('mouse:move', handlePanMove);
    canvas.on('mouse:up', handlePanEnd);
    canvas.on('mouse:out', handlePanEnd);
    
    return () => {
      if (canvas) {
        canvas.off('mouse:down', handlePan);
        canvas.off('mouse:move', handlePanMove);
        canvas.off('mouse:up', handlePanEnd);
        canvas.off('mouse:out', handlePanEnd);
      }
    };
  }, [fabricCanvasRef, handlePan, handlePanMove, handlePanEnd]);
  
  /**
   * Registers event listeners for keyboard shortcuts.
   */
  const registerKeyboardEvents = useCallback(() => {
    document.addEventListener('keydown', handleShortcut);
    
    return () => {
      document.removeEventListener('keydown', handleShortcut);
    };
  }, [handleShortcut]);
  
  /**
   * Registers all event listeners.
   */
  useEffect(() => {
    const unregisterZoom = registerZoomEvents();
    const unregisterPan = registerPanEvents();
    const unregisterKeyboard = registerKeyboardEvents();
    
    return () => {
      unregisterZoom();
      unregisterPan();
      unregisterKeyboard();
    };
  }, [registerZoomEvents, registerPanEvents, registerKeyboardEvents]);
  
  return {
    resetViewport,
    currentZoom,
    toggleSnap,
    snapEnabled,
    drawingState: undefined // Placeholder, should be populated with actual drawing state
  };
};
