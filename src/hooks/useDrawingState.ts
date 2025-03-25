
/**
 * Hook for managing drawing state
 * @module useDrawingState
 */
import { useState, useCallback, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingState, Point } from "@/types/drawingTypes";
import { DrawingTool } from "./useCanvasState";

interface UseDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
}

/**
 * Hook for managing and tracking drawing state
 */
export const useDrawingState = ({ fabricCanvasRef, tool }: UseDrawingStateProps) => {
  // Drawing state with enhanced properties for select mode  
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    currentPoint: null,
    startPoint: null,
    cursorPosition: null,
    midPoint: null,
    currentZoom: 1,
    selectionActive: false // New property to track active selection
  });

  // Store timeouts for cleanup
  const timeoutRefs = useRef<number[]>([]);

  // Clean up any pending timeouts
  const cleanupTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(timeout => window.clearTimeout(timeout));
    timeoutRefs.current = [];
  }, []);

  // Set drawing state
  const handleMouseDown = useCallback((e: any) => {
    if (!fabricCanvasRef.current) return;
    if (tool !== "straightLine" && tool !== "room" && tool !== "select") return;
    
    if (e.target && tool === "select") {
      // Handle selection of a wall or room
      if (e.target.type === 'polyline' || (e.target as any).objectType === 'line' || (e.target as any).objectType === 'room') {
        setDrawingState(prev => ({
          ...prev,
          selectionActive: true,
          currentPoint: {
            x: e.absolutePointer.x,
            y: e.absolutePointer.y
          },
          startPoint: {
            x: e.absolutePointer.x,
            y: e.absolutePointer.y
          }
        }));
      }
      return;
    }
    
    // Only handle drawing tools beyond this point
    if (tool !== "straightLine" && tool !== "room") return;
    
    const pointer = e.absolutePointer;
    
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      currentPoint: {
        x: pointer.x,
        y: pointer.y
      },
      startPoint: {
        x: pointer.x,
        y: pointer.y
      },
      cursorPosition: {
        x: e.e.clientX,
        y: e.e.clientY
      }
    }));
  }, [fabricCanvasRef, tool]);

  // Update drawing state during move
  const handleMouseMove = useCallback((e: any) => {
    if (!fabricCanvasRef.current) return;
    
    const pointer = e.absolutePointer;
    const cursorPosition = { x: e.e.clientX, y: e.e.clientY };
    
    // Handle selection dragging
    if (tool === "select" && drawingState.selectionActive) {
      setDrawingState(prev => ({
        ...prev,
        currentPoint: {
          x: pointer.x,
          y: pointer.y
        },
        cursorPosition
      }));
      return;
    }
    
    // Update cursor position for hover tooltips even when not drawing
    if (!drawingState.isDrawing && (tool === "straightLine" || tool === "room")) {
      setDrawingState(prev => ({
        ...prev,
        currentPoint: {
          x: pointer.x,
          y: pointer.y
        },
        cursorPosition
      }));
      return;
    }
    
    // Only proceed with active drawing beyond this point
    if (!drawingState.isDrawing) return;
    if (tool !== "straightLine" && tool !== "room") return;
    
    // Calculate midpoint for measurement display
    let midPoint: Point | null = null;
    if (drawingState.startPoint) {
      midPoint = {
        x: (drawingState.startPoint.x + pointer.x) / 2,
        y: (drawingState.startPoint.y + pointer.y) / 2
      };
    }
    
    setDrawingState(prev => ({
      ...prev,
      currentPoint: {
        x: pointer.x,
        y: pointer.y
      },
      cursorPosition,
      midPoint
    }));
  }, [fabricCanvasRef, tool, drawingState.isDrawing, drawingState.startPoint, drawingState.selectionActive]);

  // End drawing state
  const handleMouseUp = useCallback(() => {
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false,
      selectionActive: false
    }));
    
    // Clear points after a short delay to ensure they're available for path processing
    const timeout = window.setTimeout(() => {
      setDrawingState(prev => ({
        ...prev,
        startPoint: null,
        currentPoint: null,
        midPoint: null
      }));
    }, 300);
    
    timeoutRefs.current.push(timeout);
  }, []);

  return {
    drawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts
  };
};
