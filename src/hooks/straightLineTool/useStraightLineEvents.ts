
/**
 * Hook for managing straight line drawing events
 * @module hooks/straightLineTool/useStraightLineEvents
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Point } from "@/types/core/Point";
import { InputMethod } from "./useLineInputMethod";

interface UseStraightLineEventsProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
  isDrawing: boolean;
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  completeDrawing: (point: Point) => void;
  cancelDrawing: () => void;
}

/**
 * Hook for managing mouse/touch events for straight line drawing
 */
export const useStraightLineEvents = ({
  canvas,
  isActive,
  isDrawing,
  startDrawing,
  continueDrawing,
  completeDrawing,
  cancelDrawing
}: UseStraightLineEventsProps) => {
  /**
   * Handle mouse down event
   */
  const handleMouseDown = useCallback((e: any) => {
    if (!canvas || !isActive) return;
    
    // Prevent default behavior
    if (e.e && e.e.preventDefault) {
      e.e.preventDefault();
    }
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    const point = { x: pointer.x, y: pointer.y };
    
    // Start drawing
    startDrawing(point);
  }, [canvas, isActive, startDrawing]);
  
  /**
   * Handle mouse move event
   */
  const handleMouseMove = useCallback((e: any) => {
    if (!canvas || !isActive || !isDrawing) return;
    
    // Prevent default behavior
    if (e.e && e.e.preventDefault) {
      e.e.preventDefault();
    }
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    const point = { x: pointer.x, y: pointer.y };
    
    // Continue drawing
    continueDrawing(point);
  }, [canvas, isActive, isDrawing, continueDrawing]);
  
  /**
   * Handle mouse up event
   */
  const handleMouseUp = useCallback((e: any) => {
    if (!canvas || !isActive || !isDrawing) return;
    
    // Prevent default behavior
    if (e.e && e.e.preventDefault) {
      e.e.preventDefault();
    }
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    const point = { x: pointer.x, y: pointer.y };
    
    // Complete drawing
    completeDrawing(point);
  }, [canvas, isActive, isDrawing, completeDrawing]);
  
  /**
   * Handle keyboard events (Escape to cancel)
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isDrawing) {
      cancelDrawing();
    }
  }, [isDrawing, cancelDrawing]);
  
  /**
   * Set up event listeners when component mounts
   */
  useEffect(() => {
    if (!canvas || !isActive) return;
    
    // Add event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Clean up event listeners
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    canvas,
    isActive,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown
  ]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown
  };
};
