
/**
 * Custom hook for handling canvas drawing events
 * @module canvas/drawing/useCanvasDrawingEvents
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Path as FabricPath } from "fabric";
import { DrawingTool } from "@/hooks/useCanvasState";

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
  
  // Register zoom tracking event listeners
  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    
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
  
  // Register GIA recalculation event listeners
  useEffect(() => {
    if (!fabricCanvasRef.current || !recalculateGIA) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Update GIA when objects are added, removed or modified
    const handleObjectChange = () => {
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
