
import { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useLineState } from './useLineState';
import { useLineEvents } from './useLineEvents';
import { captureMessage } from '@/utils/sentry';
import logger from '@/utils/logger';
import { FabricEventTypes } from '@/types/fabric-events';

interface UseStraightLineToolProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

export const useStraightLineTool = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseStraightLineToolProps) => {
  // State tracking whether the tool is active
  const [isActive, setIsActive] = useState(false);
  
  // Manage line drawing state
  const lineState = useLineState();
  const { isDrawing, isToolInitialized, initializeTool } = lineState;

  // Set up event handlers
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing,
    cleanupEventHandlers
  } = useLineEvents(
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    saveCurrentState,
    lineState
  );
  
  // Initialize and clean up event handlers when tool changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    if (tool === DrawingMode.STRAIGHT_LINE) {
      // Important: Only set up the tool if it's not already active
      if (!isActive) {
        setIsActive(true);
        
        // Configure canvas for straight line drawing
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        
        // Make objects non-selectable
        canvas.getObjects().forEach(obj => {
          if ((obj as any).objectType !== 'grid') {
            obj.selectable = false;
          }
        });
        
        // Add our specific event handlers
        canvas.on(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
        canvas.on(FabricEventTypes.MOUSE_MOVE, handleMouseMove);
        canvas.on(FabricEventTypes.MOUSE_UP, handleMouseUp);
        
        // Discard any active selection
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        
        initializeTool();
        logger.info("Straight line tool initialized with event handlers", {
          isDrawingMode: canvas.isDrawingMode,
          selection: canvas.selection,
          cursor: canvas.defaultCursor
        });
        
        captureMessage("Straight line tool initialized", "straight-line-tool-init", {
          tags: { component: "useStraightLineTool" },
          extra: { 
            canvasSize: { width: canvas.width, height: canvas.height },
            settings: { 
              isDrawingMode: canvas.isDrawingMode,
              selection: canvas.selection,
              cursor: canvas.defaultCursor,
              lineColor,
              lineThickness
            }
          }
        });
      }
    } else {
      // If tool was active and is now changing, clean up
      if (isActive) {
        setIsActive(false);
        cleanupEventHandlers();
      }
    }
    
    // Clean up on unmount
    return () => {
      if (isActive) {
        cleanupEventHandlers();
      }
    };
  }, [
    fabricCanvasRef,
    tool,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupEventHandlers,
    lineColor,
    lineThickness,
    isActive,
    initializeTool
  ]);
  
  // Handle keyboard events - Escape to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && tool === DrawingMode.STRAIGHT_LINE && isDrawing) {
        cancelDrawing();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tool, isDrawing, cancelDrawing]);
  
  return {
    isDrawing,
    cancelDrawing,
    isToolInitialized,
    isActive
  };
};
