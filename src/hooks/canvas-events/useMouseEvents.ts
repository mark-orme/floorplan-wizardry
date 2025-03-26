
/**
 * Hook for handling mouse events on canvas
 * @module useMouseEvents
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { BaseEventHandlerProps, TargetEvent, EditableFabricObject } from "./types";
import logger from "@/utils/logger";

interface UseMouseEventsProps extends BaseEventHandlerProps {
  /** Function to handle mouse down event */
  handleMouseDown: (e: any) => void;
  /** Function to handle mouse move event */
  handleMouseMove: (e: any) => void;
  /** Function to handle mouse up event */
  handleMouseUp: () => void;
  /** Function to save current state before making changes */
  saveCurrentState: () => void;
}

/**
 * Hook to handle mouse events (down, move, up, double-click)
 */
export const useMouseEvents = ({
  fabricCanvasRef,
  tool,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  saveCurrentState
}: UseMouseEventsProps) => {
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    /**
     * Handle double-click to enter edit mode for walls
     * @param {TargetEvent} e - Double click event object
     */
    const handleDoubleClick = (e: TargetEvent): void => {
      if (tool === 'select' && e.target) {
        const target = e.target as EditableFabricObject;
        if (target.type === 'polyline' || target.objectType === 'line') {
          // Mark the object as being edited
          target.isEditing = true;
          
          // Save current state before editing
          saveCurrentState();
          
          // Allow for the wall to be redrawn
          fabricCanvas.discardActiveObject();
          fabricCanvas.setActiveObject(e.target);
          fabricCanvas.requestRenderAll();
        }
      }
    };
    
    fabricCanvas.on('mouse:down', handleMouseDown as any);
    fabricCanvas.on('mouse:move', handleMouseMove as any);
    fabricCanvas.on('mouse:up', handleMouseUp);
    fabricCanvas.on('mouse:dblclick', handleDoubleClick as any);
    
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('mouse:down', handleMouseDown as any);
        fabricCanvas.off('mouse:move', handleMouseMove as any);
        fabricCanvas.off('mouse:up', handleMouseUp);
        fabricCanvas.off('mouse:dblclick', handleDoubleClick as any);
      }
    };
  }, [fabricCanvasRef, handleMouseDown, handleMouseMove, handleMouseUp, tool, saveCurrentState]);
};
