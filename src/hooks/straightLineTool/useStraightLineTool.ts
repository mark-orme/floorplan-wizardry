
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

  // Debug logging for initialization tracking
  useEffect(() => {
    console.log("Straight line tool status:", {
      tool,
      isActive,
      isToolInitialized,
      hasCanvas: !!fabricCanvasRef.current
    });
    
    // Capture tool status in Sentry for diagnostics
    captureMessage("Straight line tool status update", "straight-line-status", {
      tags: { component: "useStraightLineTool" },
      extra: {
        tool,
        isActive,
        isToolInitialized,
        hasCanvas: !!fabricCanvasRef.current,
        timestamp: new Date().toISOString()
      }
    });
  }, [tool, isActive, isToolInitialized, fabricCanvasRef]);

  // Initialize and clean up event handlers when tool changes
  useEffect(() => {
    // Start a Sentry transaction for tool setup
    const transactionName = "straight-line-tool-setup";
    
    try {
      // Using a delayed check to give the canvas time to initialize
      const checkAndSetupTool = () => {
        const canvas = fabricCanvasRef.current;
        
        // Early return if canvas isn't available yet
        if (!canvas) {
          logger.warn("Canvas not available for straight line tool");
          console.warn("Canvas not available for straight line tool, will retry");
          
          captureMessage("Canvas not available for straight line tool", "canvas-unavailable", {
            level: "warning",
            tags: { tool, component: "useStraightLineTool", phase: "initialization" }
          });
          
          return false;
        }
        
        // Only set up if the tool is straight line and not already active
        if (tool === DrawingMode.STRAIGHT_LINE) {
          if (!isActive) {
            logger.info("Activating straight line tool");
            console.log("🖊️ Activating straight line tool on canvas:", canvas);
            setIsActive(true);
            hasCleanedUpRef.current = false;
            
            // Track activation in Sentry
            captureMessage("Straight line tool activation", "straight-line-activate", {
              tags: { 
                component: "useStraightLineTool", 
                canvasType: canvas?.constructor?.name || "unknown"
              },
              extra: {
                canvasWidth: canvas.width,
                canvasHeight: canvas.height,
                objectCount: canvas.getObjects().length,
                timestamp: new Date().toISOString()
              }
            });
            
            try {
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
              
              // IMPROVED: Remove any existing event handlers to prevent duplicates
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
              
              // Verify setup was successful
              const toolVerification = validateStraightLineTool(canvas, DrawingMode.STRAIGHT_LINE);
              
              captureMessage("Straight line tool event handlers attached", "event-handlers-attached", {
                tags: { component: "useStraightLineTool", success: String(toolVerification) },
                extra: {
                  hasMouseDown: !!canvas.__eventListeners?.['mouse:down']?.length,
                  hasMouseMove: !!canvas.__eventListeners?.['mouse:move']?.length,
                  hasMouseUp: !!canvas.__eventListeners?.['mouse:up']?.length,
                  canvasConfig: {
                    isDrawingMode: canvas.isDrawingMode,
                    selection: canvas.selection,
                    defaultCursor: canvas.defaultCursor
                  }
                }
              });
              
              // Notify user that the tool is active
              toast.success("Line drawing tool activated", {
                id: "line-tool-activated"
              });
              
              return true;
            } catch (error) {
              // Detailed error capture with setup state
              captureError(error as Error, "straight-line-setup-error", {
                tags: { component: "useStraightLineTool", phase: "canvas-configuration" },
                extra: {
                  canvasAvailable: !!canvas,
                  toolState: { tool, isActive, isToolInitialized },
                  eventListeners: canvas.__eventListeners ? Object.keys(canvas.__eventListeners) : [],
                }
              });
              
              logger.error("Error during straight line tool setup", error);
              toast.error("Could not set up drawing tool");
              return false;
            }
          }
        } else {
          // If tool was active and is now changing, clean up
          if (isActive && !hasCleanedUpRef.current) {
            logger.info("Deactivating straight line tool");
            cleanupEventHandlers();
            setIsActive(false);
            hasCleanedUpRef.current = true;
            
            // Track deactivation in Sentry
            captureMessage("Straight line tool deactivated", "straight-line-deactivate", {
              tags: { component: "useStraightLineTool", newTool: tool }
            });
            
            // Reset cursor and selection behavior
            if (canvas) {
              canvas.defaultCursor = 'default';
              canvas.selection = true;
              canvas.requestRenderAll();
            }
          }
        }
        
        return true;
      };
      
      // Try immediately
      const setupSuccess = checkAndSetupTool();
      
      // If failed on first try, set up retry with timeout
      if (!setupSuccess && tool === DrawingMode.STRAIGHT_LINE) {
        // Capture initial failure
        captureMessage("Straight line tool setup failed initially", "setup-retry-needed", {
          tags: { component: "useStraightLineTool" },
          extra: { 
            hasCanvas: !!fabricCanvasRef.current,
            willRetry: true
          }
        });
        
        // Retry after a short delay to allow canvas to initialize
        const retryTimer = setTimeout(() => {
          console.log("🔄 Retrying straight line tool setup...");
          
          captureMessage("Retrying straight line tool setup", "setup-retry-attempt", {
            tags: { component: "useStraightLineTool", attempt: "1" }
          });
          
          checkAndSetupTool();
        }, 500);
        
        // Retry a second time with a longer delay if still not successful
        const secondRetryTimer = setTimeout(() => {
          if (tool === DrawingMode.STRAIGHT_LINE && !isActive) {
            console.log("🔄 Second retry attempt for straight line tool setup...");
            
            captureMessage("Second retry for straight line tool setup", "setup-retry-attempt", {
              tags: { component: "useStraightLineTool", attempt: "2" }
            });
            
            const success = checkAndSetupTool();
            if (!success) {
              console.error("Failed to initialize straight line tool after multiple attempts");
              
              captureError(
                new Error("Failed to initialize straight line tool after multiple attempts"),
                "straight-line-setup-failed",
                {
                  tags: { component: "useStraightLineTool", critical: "true" },
                  extra: {
                    canvasState: fabricCanvasRef.current ? {
                      width: fabricCanvasRef.current.width,
                      height: fabricCanvasRef.current.height,
                      objectCount: fabricCanvasRef.current.getObjects().length
                    } : "canvas unavailable",
                    diagnostics: {
                      tool,
                      isActive,
                      isToolInitialized,
                      timestamp: new Date().toISOString()
                    }
                  }
                }
              );
              
              toast.error("Could not initialize line tool. Try selecting a different tool and coming back.");
            }
          }
        }, 1500);
        
        return () => {
          clearTimeout(retryTimer);
          clearTimeout(secondRetryTimer);
          if (isActive && !hasCleanedUpRef.current) {
            logger.info("Cleaning up straight line tool on unmount");
            cleanupEventHandlers();
            hasCleanedUpRef.current = true;
            
            captureMessage("Straight line tool cleanup on retry timeout", "cleanup-on-timeout");
          }
        };
      }
      
      // Clean up on unmount
      return () => {
        if (isActive && !hasCleanedUpRef.current) {
          logger.info("Cleaning up straight line tool on unmount");
          cleanupEventHandlers();
          hasCleanedUpRef.current = true;
          
          captureMessage("Straight line tool cleanup on unmount", "cleanup-on-unmount");
        }
      };
    } catch (error) {
      // Catch any unexpected errors in the effect itself
      captureError(error as Error, "straight-line-effect-error", {
        tags: { component: "useStraightLineTool", phase: "effect-execution" },
        extra: { 
          tool, 
          isActive, 
          isToolInitialized,
          hasCanvas: !!fabricCanvasRef.current
        }
      });
      
      logger.error("Unexpected error in straight line tool effect", error);
      return () => {}; // Return empty cleanup function
    }
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
    initializeTool,
    isToolInitialized
  ]);
  
  // Handle keyboard events - Escape to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && tool === DrawingMode.STRAIGHT_LINE && isDrawing) {
        captureMessage("Line drawing canceled with Escape key", "line-drawing-escape");
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
