
/**
 * Hook for handling straight line drawing functionality
 * Manages canvas interaction for drawing precise straight lines
 * @module hooks/straightLineTool/useStraightLineTool
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useLineState } from './useLineState';
import { useLineEvents } from './useLineEvents';
import { captureMessage, captureError } from '@/utils/sentry';
import logger from '@/utils/logger';
import { FabricEventTypes } from '@/types/fabric-events';
import { toast } from 'sonner';
import { validateStraightLineTool } from '@/utils/diagnostics/straightLineValidator';

/**
 * Props for useStraightLineTool hook
 * @interface UseStraightLineToolProps
 */
interface UseStraightLineToolProps {
  /**
   * Reference to the Fabric.js canvas instance
   */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  
  /**
   * Current active drawing tool
   */
  tool: DrawingMode;
  
  /**
   * Color for drawing lines
   */
  lineColor: string;
  
  /**
   * Thickness for drawing lines
   */
  lineThickness: number;
  
  /**
   * Function to save current canvas state for undo/redo operations
   */
  saveCurrentState: () => void;
}

/**
 * Return type for useStraightLineTool hook
 * @interface UseStraightLineToolResult
 */
interface UseStraightLineToolResult {
  /**
   * Whether a line is currently being drawn
   */
  isDrawing: boolean;
  
  /**
   * Function to cancel the current drawing operation
   */
  cancelDrawing: () => void;
  
  /**
   * Whether the tool has been properly initialized
   */
  isToolInitialized: boolean;
  
  /**
   * Whether the tool is currently active
   */
  isActive: boolean;
}

/**
 * Custom hook for straight line drawing tool functionality
 * Manages the tool state, event handlers, and canvas interactions
 * 
 * @param {UseStraightLineToolProps} props - Hook input properties
 * @returns {UseStraightLineToolResult} Hook output interface
 */
export const useStraightLineTool = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseStraightLineToolProps): UseStraightLineToolResult => {
  // State tracking whether the tool is active
  const [isActive, setIsActive] = useState(false);
  
  // Track if we've already cleaned up event handlers to prevent duplicate cleanup
  const hasCleanedUpRef = useRef(false);
  
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
    // Using a delayed check to give the canvas time to initialize
    const checkAndSetupTool = () => {
      const canvas = fabricCanvasRef.current;
      
      // Early return if canvas isn't available yet
      if (!canvas) {
        logger.warn("Canvas not available for straight line tool");
        console.warn("Canvas not available for straight line tool, will retry");
        return false;
      }
      
      // Only set up if the tool is straight line and not already active
      if (tool === DrawingMode.STRAIGHT_LINE) {
        if (!isActive) {
          logger.info("Activating straight line tool");
          console.log("🖊️ Activating straight line tool on canvas:", canvas);
          setIsActive(true);
          hasCleanedUpRef.current = false;
          
          // Configure canvas for straight line drawing
          canvas.isDrawingMode = false;
          canvas.selection = false;
          canvas.defaultCursor = 'crosshair';
          canvas.hoverCursor = 'crosshair';
          
          // Make objects non-selectable except grid
          canvas.getObjects().forEach(obj => {
            if ((obj as any).objectType !== 'grid') {
              obj.selectable = false;
            }
          });
          
          // IMPROVED: Use the FabricEventTypes enum for consistent event naming
          canvas.off(FabricEventTypes.MOUSE_DOWN);
          canvas.off(FabricEventTypes.MOUSE_MOVE);
          canvas.off(FabricEventTypes.MOUSE_UP);
          
          // IMPROVED: Make sure we're using the correct event types
          canvas.on(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
          canvas.on(FabricEventTypes.MOUSE_MOVE, handleMouseMove);
          canvas.on(FabricEventTypes.MOUSE_UP, handleMouseUp);
          
          // Discard any active selection
          canvas.discardActiveObject();
          canvas.requestRenderAll();
          
          // Important: Initialize the tool state
          initializeTool();
          
          logger.info("Straight line tool initialized with event handlers", {
            isDrawingMode: canvas.isDrawingMode,
            selection: canvas.selection,
            cursor: canvas.defaultCursor
          });
          
          // Notify user that the tool is active
          toast.success("Line drawing tool activated", {
            id: "line-tool-activated"
          });
          
          return true;
        }
      } else {
        // If tool was active and is now changing, clean up
        if (isActive && !hasCleanedUpRef.current) {
          logger.info("Deactivating straight line tool");
          cleanupEventHandlers();
          setIsActive(false);
          hasCleanedUpRef.current = true;
        }
      }
      
      return true;
    };
    
    // Try immediately
    const setupSuccess = checkAndSetupTool();
    
    // If failed on first try, set up retry with timeout
    if (!setupSuccess && tool === DrawingMode.STRAIGHT_LINE) {
      // Retry after a short delay to allow canvas to initialize
      const retryTimer = setTimeout(() => {
        console.log("🔄 Retrying straight line tool setup...");
        checkAndSetupTool();
      }, 500);
      
      return () => {
        clearTimeout(retryTimer);
        if (isActive && !hasCleanedUpRef.current) {
          logger.info("Cleaning up straight line tool on unmount");
          cleanupEventHandlers();
          hasCleanedUpRef.current = true;
        }
      };
    }
    
    // Clean up on unmount
    return () => {
      if (isActive && !hasCleanedUpRef.current) {
        logger.info("Cleaning up straight line tool on unmount");
        cleanupEventHandlers();
        hasCleanedUpRef.current = true;
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
