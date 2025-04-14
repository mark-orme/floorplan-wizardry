
/**
 * Event handling for the straight line tool
 * @module hooks/straightLineTool/useStraightLineEvents
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas, TEvent } from 'fabric';
import { Point } from '@/types/core/Point';
import { TPointerEvent } from '@/types/fabric-events';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';
import { getPointerCoordinates, hasValidCoordinates } from '@/utils/fabric/eventHelpers';

interface UseStraightLineEventsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  isActive: boolean;
  isDrawing: boolean;
  handlePointerDown: (point: Point) => void;
  handlePointerMove: (point: Point) => void;
  handlePointerUp: (point: Point) => void;
  inputMethod: 'mouse' | 'touch' | 'stylus' | 'unknown';
}

/**
 * Hook to handle Fabric.js events for the straight line tool
 */
export const useStraightLineEvents = ({
  fabricCanvasRef,
  isActive,
  isDrawing,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  inputMethod
}: UseStraightLineEventsProps) => {
  const { reportDrawingError } = useDrawingErrorReporting();
  
  /**
   * Handle Fabric.js mouse down event
   */
  const handleFabricMouseDown = useCallback((e: TEvent<TPointerEvent>) => {
    if (!isActive || !e) return;
    
    try {
      // Get position from fabric event using our helper
      if (hasValidCoordinates(e)) {
        const point = getPointerCoordinates(e);
        handlePointerDown(point);
      }
    } catch (error) {
      reportDrawingError(error, 'line-mouse-down', {
        interaction: { type: inputMethod }
      });
    }
  }, [isActive, handlePointerDown, reportDrawingError, inputMethod]);
  
  /**
   * Handle Fabric.js mouse move event
   */
  const handleFabricMouseMove = useCallback((e: TEvent<TPointerEvent>) => {
    if (!isActive || !isDrawing || !e) return;
    
    try {
      // Get position from fabric event using our helper
      if (hasValidCoordinates(e)) {
        const point = getPointerCoordinates(e);
        handlePointerMove(point);
      }
    } catch (error) {
      reportDrawingError(error, 'line-mouse-move', {
        interaction: { type: inputMethod }
      });
    }
  }, [isActive, isDrawing, handlePointerMove, reportDrawingError, inputMethod]);
  
  /**
   * Handle Fabric.js mouse up event
   */
  const handleFabricMouseUp = useCallback((e: TEvent<TPointerEvent>) => {
    if (!isActive || !isDrawing || !e) return;
    
    try {
      // Get position from fabric event using our helper
      if (hasValidCoordinates(e)) {
        const point = getPointerCoordinates(e);
        handlePointerUp(point);
      }
    } catch (error) {
      reportDrawingError(error, 'line-mouse-up', {
        interaction: { type: inputMethod }
      });
    }
  }, [isActive, isDrawing, handlePointerUp, reportDrawingError, inputMethod]);

  return {
    handleFabricMouseDown,
    handleFabricMouseMove,
    handleFabricMouseUp
  };
};
