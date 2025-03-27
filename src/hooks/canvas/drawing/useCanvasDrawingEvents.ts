
/**
 * Custom hook for handling canvas drawing events
 * @module canvas/drawing/useCanvasDrawingEvents
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Path as FabricPath } from "fabric";
import { DrawingTool } from "@/hooks/useCanvasState";
import logger from "@/utils/logger";

interface UseCanvasDrawingEventsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
  saveCurrentState: () => void;
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  handleMouseUp: (e?: MouseEvent | TouchEvent) => void;
  processCreatedPath: (path: FabricPath) => void;
  updateZoomLevel: () => void;
  recalculateGIA?: () => void;
  deleteSelectedObjects?: () => void;
}

/**
 * Hook for registering canvas drawing event handlers
 * @param {UseCanvasDrawingEventsProps} props - Hook properties
 * @returns Event registration and cleanup functions
 */
export const useCanvasDrawingEvents = (props: UseCanvasDrawingEventsProps) => {
  const {
    fabricCanvasRef,
    tool,
    saveCurrentState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    processCreatedPath,
    updateZoomLevel,
    recalculateGIA,
    deleteSelectedObjects
  } = props;
  
  // Register path creation events
  useEffect(() => {
    console.log("Setting up path creation events for tool:", tool);
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Handler for path created event - this is crucial for drawing
    const handlePathCreated = (e: any) => {
      console.log("Path created event fired:", e);
      if (e.path) {
        processCreatedPath(e.path);
      }
    };
    
    // Add the path created listener
    canvas.on('path:created', handlePathCreated);
    
    // Additional logging for debugging
    canvas.on('mouse:down', () => console.log("Canvas mouse:down event fired"));
    canvas.on('mouse:move', () => console.log("Canvas mouse:move event triggered"));
    canvas.on('mouse:up', () => console.log("Canvas mouse:up event triggered"));
    
    console.log("Path creation event handlers registered");
    
    return () => {
      if (canvas) {
        canvas.off('path:created', handlePathCreated);
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        canvas.off('mouse:up');
      }
    };
  }, [fabricCanvasRef, processCreatedPath, tool]);
  
  // Register zoom tracking event listeners
  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    
    console.log("Setting up zoom tracking events");
    
    // Use type assertion to allow custom events
    const canvas = fabricCanvas as unknown as {
      on(event: string, handler: Function): void;
      off(event: string, handler: Function): void;
    };
    
    // Listen for both standard zoom events and our custom event
    canvas.on('zoom:changed', updateZoomLevel);
    canvas.on('custom:zoom-changed', updateZoomLevel);
    
    // Also update on viewport transform changes
    canvas.on('viewport:transform', updateZoomLevel);
    
    // Initial update
    updateZoomLevel();
    
    return () => {
      canvas.off('zoom:changed', updateZoomLevel);
      canvas.off('custom:zoom-changed', updateZoomLevel);
      canvas.off('viewport:transform', updateZoomLevel);
    };
  }, [fabricCanvasRef, updateZoomLevel]);
  
  // Register mouse and touch event handlers directly
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    console.log("Setting up mouse/touch event handlers for tool:", tool);
    
    if (tool === 'draw' || tool === 'straightLine' || tool === 'wall' || tool === 'room') {
      // Set drawing mode based on the tool
      canvas.isDrawingMode = tool === 'draw';
      
      if (canvas.isDrawingMode) {
        console.log("Canvas drawing mode enabled");
      } else {
        console.log("Canvas drawing mode disabled (using managed interactions)");
      }
    }
    
    return () => {
      // No cleanup needed here as the next effect run will update the drawing mode
    };
  }, [fabricCanvasRef, tool]);
  
  // Register GIA recalculation event listeners
  useEffect(() => {
    if (!fabricCanvasRef.current || !recalculateGIA) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Update GIA when objects are added, removed or modified
    const handleObjectChange = () => {
      console.log("Object change detected, recalculating GIA");
      if (recalculateGIA && typeof recalculateGIA === 'function') {
        recalculateGIA();
      }
    };
    
    canvas.on('object:added', handleObjectChange);
    canvas.on('object:removed', handleObjectChange);
    canvas.on('object:modified', handleObjectChange);
    
    return () => {
      canvas.off('object:added', handleObjectChange);
      canvas.off('object:removed', handleObjectChange);
      canvas.off('object:modified', handleObjectChange);
    };
  }, [fabricCanvasRef, recalculateGIA]);
  
  return {
    updateZoomLevel
  };
};
