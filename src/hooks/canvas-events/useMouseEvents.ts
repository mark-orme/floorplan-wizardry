
import { useCallback } from "react";
import { EventHandlerResult } from "./types";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "@/constants/drawingModes";

/**
 * Props for useMouseEvents hook
 */
interface UseMouseEventsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Function to handle mouse down */
  handleMouseDown?: (e: MouseEvent | TouchEvent) => void;
  /** Function to handle mouse move */
  handleMouseMove?: (e: MouseEvent | TouchEvent) => void;
  /** Function to handle mouse up */
  handleMouseUp?: (e?: MouseEvent | TouchEvent) => void;
}

/**
 * Hook for handling mouse events
 * @param props - Hook properties
 * @returns Event handler registration and cleanup functions
 */
export const useMouseEvents = (props: UseMouseEventsProps): EventHandlerResult => {
  const { 
    fabricCanvasRef, 
    tool,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = props;
  
  /**
   * Register mouse event handlers
   */
  const register = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Process mouse down
    const onMouseDown = (e: any) => {
      if (handleMouseDown) {
        handleMouseDown(e.e);
      }
    };
    
    // Process mouse move
    const onMouseMove = (e: any) => {
      if (handleMouseMove) {
        handleMouseMove(e.e);
      }
    };
    
    // Process mouse up
    const onMouseUp = (e: any) => {
      if (handleMouseUp) {
        handleMouseUp(e?.e);
      }
    };
    
    // Register event handlers
    canvas.on('mouse:down', onMouseDown);
    canvas.on('mouse:move', onMouseMove);
    canvas.on('mouse:up', onMouseUp);
    
    console.log("Registered mouse handlers");
  }, [fabricCanvasRef, tool, handleMouseDown, handleMouseMove, handleMouseUp]);

  /**
   * Unregister mouse event handlers
   */
  const unregister = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove event handlers
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    
    console.log("Unregistering mouse handlers");
  }, [fabricCanvasRef]);

  /**
   * Clean up mouse event handlers
   */
  const cleanup = useCallback(() => {
    // Unregister event handlers
    unregister();
    console.log("Cleaning up mouse handlers");
  }, [unregister]);

  return {
    register,
    unregister,
    cleanup
  };
};
