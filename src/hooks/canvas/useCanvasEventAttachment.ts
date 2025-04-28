
import { useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { asExtendedCanvas, asExtendedObject } from '@/utils/canvas/canvasTypeUtils';
import { ExtendedFabricCanvas } from '@/types/ExtendedFabricCanvas';

/**
 * Canvas event handler type
 */
export type CanvasEventHandler = (event: any) => void;

/**
 * Canvas event handlers
 */
export interface CanvasEventHandlers {
  handleMouseDown: CanvasEventHandler;
  handleMouseMove: CanvasEventHandler;
  handleMouseUp: CanvasEventHandler;
}

/**
 * Hook for attaching event handlers to canvas
 * @param canvas Fabric canvas instance
 * @param handlers Canvas event handlers
 * @param activeTool Active drawing tool
 * @returns Functions to attach and detach event handlers
 */
export const useCanvasEventAttachment = (
  canvas: FabricCanvas | null,
  handlers: CanvasEventHandlers,
  activeTool: DrawingMode
) => {
  const { handleMouseDown, handleMouseMove, handleMouseUp } = handlers;
  
  /**
   * Attach event handlers to canvas
   */
  const attachEventHandlers = useCallback((): void => {
    if (!canvas) return;
    
    // Attach mouse events
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('mouse:out', handleMouseUp);
  }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  /**
   * Detach event handlers from canvas
   */
  const detachEventHandlers = useCallback((): void => {
    if (!canvas) return;
    
    // Detach mouse events
    canvas.off('mouse:down', handleMouseDown);
    canvas.off('mouse:move', handleMouseMove);
    canvas.off('mouse:up', handleMouseUp);
    canvas.off('mouse:out', handleMouseUp);
  }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  // Attach and detach events based on active tool
  useEffect(() => {
    // Only attach events if we're in a drawing mode
    if (activeTool !== DrawingMode.SELECT && canvas) {
      attachEventHandlers();
      
      // Make sure selection is disabled in drawing modes
      canvas.selection = false;
      
      // Use extended canvas to access forEachObject
      const extCanvas = asExtendedCanvas(canvas);
      if (extCanvas) {
        // Using a workaround for forEachObject
        const objects = extCanvas.getObjects();
        if (objects) {
          objects.forEach(obj => {
            const extObj = asExtendedObject(obj);
            if (extObj) {
              extObj.selectable = false;
              extObj.evented = false;
            }
          });
        }
      }
    } else if (canvas) {
      // Re-enable selection in select mode
      canvas.selection = true;
      
      // Use extended canvas to access forEachObject
      const extCanvas = asExtendedCanvas(canvas);
      if (extCanvas) {
        // Using a workaround for forEachObject
        const objects = extCanvas.getObjects();
        if (objects) {
          objects.forEach(obj => {
            const extObj = asExtendedObject(obj);
            if (extObj) {
              extObj.selectable = true;
              extObj.evented = true;
            }
          });
        }
      }
    }
    
    // Cleanup on unmount or tool change
    return detachEventHandlers;
  }, [canvas, activeTool, attachEventHandlers, detachEventHandlers]);
  
  return {
    attachEventHandlers,
    detachEventHandlers
  };
};
