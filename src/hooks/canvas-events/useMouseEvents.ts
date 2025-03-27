
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
 * @interface UseMouseEventsProps
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
 * Interface for source capabilities detection
 * @interface SourceCapabilities
 */
interface SourceCapabilities {
  firesTouchEvents: boolean;
}

/**
 * Extended MouseEvent type that includes source capabilities
 * @interface ExtendedMouseEvent
 */
interface ExtendedMouseEvent extends MouseEvent {
  sourceCapabilities?: SourceCapabilities;
}

/**
 * Extended PointerEvent type from fabric
 * @interface ExtendedPointerEvent
 */
interface ExtendedPointerEvent {
  pointerType?: string;
  e?: {
    type?: string;
  };
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
    
    /**
     * Checks if an event originated from touch to avoid double handling
     * @param {unknown} e - Event to check
     * @returns {boolean} True if event is from touch
     */
    const isFromTouchEvent = (e: unknown): boolean => {
      // Check sourceCapabilities
      const mouseEvent = e as ExtendedMouseEvent;
      if (mouseEvent.sourceCapabilities?.firesTouchEvents) {
        return true;
      }
      
      // Check for touch events in pointer/mouse event
      const pointerEvent = e as ExtendedPointerEvent;
      if (pointerEvent.pointerType === 'touch' || 
          (pointerEvent.e?.type && pointerEvent.e.type.startsWith('touch'))) {
        return true;
      }
      
      return false;
    };
    
    /**
     * Handle mouse down event
     * @param {unknown} e - Mouse down event
     */
    const fabricMouseDown = (e: unknown) => {
      // Skip if from touch event
      if (isFromTouchEvent(e)) return;
      
      handleMouseDown(e as MouseEvent);
    };
    
    /**
     * Handle mouse move event
     * @param {unknown} e - Mouse move event
     */
    const fabricMouseMove = (e: unknown) => {
      // Skip if from touch event
      if (isFromTouchEvent(e)) return;
      
      handleMouseMove(e as MouseEvent);
    };
    
    /**
     * Handle mouse up event
     * @param {unknown} e - Mouse up event
     */
    const fabricMouseUp = (e: unknown) => {
      // Skip if from touch event
      if (isFromTouchEvent(e)) return;
      
      handleMouseUp(e as MouseEvent);
    };
    
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
    
    // Check if running on iOS or iPad
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Register events - we're using Fabric.js events for mouse handling
    fabricCanvas.on('mouse:down', fabricMouseDown as FabricEventHandler);
    fabricCanvas.on('mouse:move', fabricMouseMove as FabricEventHandler);
    fabricCanvas.on('mouse:up', fabricMouseUp as FabricEventHandler);
    fabricCanvas.on('mouse:dblclick', handleDoubleClick as FabricEventHandler);
    
    // Log event registration
    console.log("Mouse events registered:", isIOS ? "iOS optimized" : "standard");
    
    return () => {
      // Clean up all event handlers on unmount
      if (fabricCanvas) {
        fabricCanvas.off('mouse:down', fabricMouseDown as FabricEventHandler);
        fabricCanvas.off('mouse:move', fabricMouseMove as FabricEventHandler);
        fabricCanvas.off('mouse:up', fabricMouseUp as FabricEventHandler);
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
