
/**
 * Hook for handling mouse events on canvas
 * @module useMouseEvents
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { BaseEventHandlerProps, TargetEvent, EditableFabricObject, EventHandlerResult } from "./types";
import logger from "@/utils/logger";

/**
 * Props for the useMouseEvents hook
 */
interface UseMouseEventsProps extends BaseEventHandlerProps {
  /** Function to handle mouse down event */
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  /** Function to handle mouse move event */
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  /** Function to handle mouse up event */
  handleMouseUp: (e?: MouseEvent | TouchEvent) => void;
  /** Function to save current state before making changes */
  saveCurrentState: () => void;
}

/**
 * Hook to handle mouse events (down, move, up, double-click)
 * @param {UseMouseEventsProps} props - Hook properties
 * @returns {EventHandlerResult} Cleanup function
 */
export const useMouseEvents = ({
  fabricCanvasRef,
  tool,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  saveCurrentState
}: UseMouseEventsProps): EventHandlerResult => {
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    // Type for mouse event handlers that matches Fabric.js expectations
    type FabricEventHandler = (e: unknown) => void;
    
    // Cast to Fabric event handler type
    const fabricMouseDown = handleMouseDown as FabricEventHandler;
    const fabricMouseMove = handleMouseMove as FabricEventHandler;
    const fabricMouseUp = handleMouseUp as FabricEventHandler;
    
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
    
    // Check if running on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // For iOS, use the lower-level DOM events in addition to Fabric events
    if (isIOS && fabricCanvas.upperCanvasEl) {
      // Set touch-action to none to prevent browser gestures
      fabricCanvas.upperCanvasEl.style.touchAction = 'none';
      
      // Directly attach DOM touch events with passive: false for iOS
      const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault(); // Prevent default to avoid iOS Safari issues
        fabricMouseDown(e);
      };
      
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault(); // Prevent default to avoid iOS Safari issues
        fabricMouseMove(e);
      };
      
      const handleTouchEnd = (e: TouchEvent) => {
        e.preventDefault(); // Prevent default to avoid iOS Safari issues
        fabricMouseUp(e);
      };
      
      fabricCanvas.upperCanvasEl.addEventListener('touchstart', handleTouchStart, { passive: false });
      fabricCanvas.upperCanvasEl.addEventListener('touchmove', handleTouchMove, { passive: false });
      fabricCanvas.upperCanvasEl.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      // Clean up DOM event listeners
      return () => {
        if (fabricCanvas.upperCanvasEl) {
          fabricCanvas.upperCanvasEl.removeEventListener('touchstart', handleTouchStart);
          fabricCanvas.upperCanvasEl.removeEventListener('touchmove', handleTouchMove);
          fabricCanvas.upperCanvasEl.removeEventListener('touchend', handleTouchEnd);
        }
        
        if (fabricCanvas) {
          fabricCanvas.off('mouse:down', fabricMouseDown);
          fabricCanvas.off('mouse:move', fabricMouseMove);
          fabricCanvas.off('mouse:up', fabricMouseUp);
          fabricCanvas.off('mouse:dblclick', handleDoubleClick as FabricEventHandler);
        }
      };
    }
    
    // For non-iOS, use fabric's standard events
    fabricCanvas.on('mouse:down', fabricMouseDown);
    fabricCanvas.on('mouse:move', fabricMouseMove);
    fabricCanvas.on('mouse:up', fabricMouseUp);
    fabricCanvas.on('mouse:dblclick', handleDoubleClick as FabricEventHandler);
    
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('mouse:down', fabricMouseDown);
        fabricCanvas.off('mouse:move', fabricMouseMove);
        fabricCanvas.off('mouse:up', fabricMouseUp);
        fabricCanvas.off('mouse:dblclick', handleDoubleClick as FabricEventHandler);
      }
    };
  }, [fabricCanvasRef, handleMouseDown, handleMouseMove, handleMouseUp, tool, saveCurrentState]);

  return {
    cleanup: () => {
      if (fabricCanvasRef.current) {
        logger.debug("Mouse events cleanup");
      }
    }
  };
};
