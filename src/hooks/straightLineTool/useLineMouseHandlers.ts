
/**
 * Hook for mouse handler functions for the line tool
 * @module hooks/straightLineTool/useLineMouseHandlers
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Point } from "@/types/core/Point";
import { InputMethod } from "./useLineInputMethod";

interface UseLineMouseHandlersProps {
  canvas: FabricCanvas | null;
  isDrawing: boolean;
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  completeDrawing: (point: Point) => void;
  setCursorStyle: (isDrawing: boolean) => void;
}

/**
 * Hook for managing mouse handlers for the line drawing tool
 */
export const useLineMouseHandlers = ({
  canvas,
  isDrawing,
  startDrawing,
  continueDrawing,
  completeDrawing,
  setCursorStyle
}: UseLineMouseHandlersProps) => {
  /**
   * Handle mouse down event
   */
  const handleMouseDown = useCallback((e: any) => {
    if (!canvas) return;
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    const point = { x: pointer.x, y: pointer.y };
    
    // Start drawing
    startDrawing(point);
    
    // Set cursor style
    setCursorStyle(true);
    
    // Prevent default behavior
    e.e.preventDefault();
  }, [canvas, startDrawing, setCursorStyle]);
  
  /**
   * Handle mouse move event
   */
  const handleMouseMove = useCallback((e: any) => {
    if (!canvas || !isDrawing) return;
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    const point = { x: pointer.x, y: pointer.y };
    
    // Continue drawing
    continueDrawing(point);
    
    // Prevent default behavior
    e.e.preventDefault();
  }, [canvas, isDrawing, continueDrawing]);
  
  /**
   * Handle mouse up event
   */
  const handleMouseUp = useCallback((e: any) => {
    if (!canvas || !isDrawing) return;
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    const point = { x: pointer.x, y: pointer.y };
    
    // Complete drawing
    completeDrawing(point);
    
    // Reset cursor style
    setCursorStyle(false);
    
    // Prevent default behavior
    e.e.preventDefault();
  }, [canvas, isDrawing, completeDrawing, setCursorStyle]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
