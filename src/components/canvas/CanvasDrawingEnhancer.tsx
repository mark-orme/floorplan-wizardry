
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import { captureMessage } from '@/utils/sentry';

interface CanvasDrawingEnhancerProps {
  canvas: FabricCanvas | null;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
}

/**
 * Component that enhances drawing functionality on canvas
 * Ensures drawing tools work correctly and monitors for issues
 */
export const CanvasDrawingEnhancer: React.FC<CanvasDrawingEnhancerProps> = ({
  canvas,
  tool = DrawingMode.SELECT,
  lineColor = "#000000",
  lineThickness = 2
}) => {
  const setUpCompleteRef = useRef(false);
  const lastToolRef = useRef(tool);
  const issuesFoundRef = useRef(0);
  
  // Main setup effect for drawing tools
  useEffect(() => {
    if (!canvas) return;
    
    logger.info(`Setting up drawing enhancer for tool: ${tool}`);
    lastToolRef.current = tool;
    
    const setupDrawingMode = () => {
      try {
        // Set up drawing mode based on current tool
        canvas.isDrawingMode = tool === DrawingMode.DRAW;
        
        // Configure brush settings
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
        } else {
          logger.error("Drawing brush not available");
          captureMessage('Drawing brush not available', 'drawing-error', {
            level: 'error',
            tags: { component: 'CanvasDrawingEnhancer' }
          });
        }
        
        // Configure selection mode
        canvas.selection = tool === DrawingMode.SELECT;
        
        // Apply other tool-specific settings
        switch (tool) {
          case DrawingMode.HAND:
            canvas.defaultCursor = 'grab';
            canvas.hoverCursor = 'grab';
            if (canvas.wrapperEl) {
              canvas.wrapperEl.style.touchAction = 'pan-x pan-y';
            }
            break;
            
          case DrawingMode.LINE:
          case DrawingMode.RECTANGLE:
          case DrawingMode.CIRCLE:
            canvas.defaultCursor = 'crosshair';
            canvas.hoverCursor = 'crosshair';
            if (canvas.wrapperEl) {
              canvas.wrapperEl.style.touchAction = 'none';
            }
            break;
            
          case DrawingMode.SELECT:
            canvas.defaultCursor = 'default';
            canvas.hoverCursor = 'move';
            break;
            
          case DrawingMode.DRAW:
            canvas.defaultCursor = 'crosshair';
            canvas.hoverCursor = 'crosshair';
            if (canvas.wrapperEl) {
              canvas.wrapperEl.style.touchAction = 'none';
            }
            break;
            
          default:
            canvas.defaultCursor = 'default';
        }
        
        // Force render
        canvas.requestRenderAll();
        
        // Add to application state for Sentry context
        if (typeof window !== 'undefined' && window.__canvas_state) {
          window.__canvas_state.currentTool = tool;
        }
        
        setUpCompleteRef.current = true;
        logger.info("Drawing enhancer setup complete");
      } catch (error) {
        logger.error("Error setting up drawing mode:", error);
        issuesFoundRef.current += 1;
        
        if (issuesFoundRef.current >= 3) {
          captureMessage('Persistent drawing setup issues', 'drawing-error', {
            level: 'error',
            tags: { 
              component: 'CanvasDrawingEnhancer',
              tool: tool
            },
            extra: { 
              error: String(error),
              attempts: issuesFoundRef.current
            }
          });
        }
      }
    };
    
    setupDrawingMode();
    
    // Add event listener for mousedown to confirm drawing mode is working
    const handleMouseDown = () => {
      if (tool === DrawingMode.DRAW && !canvas.isDrawingMode) {
        logger.warn("Drawing mode not properly set, fixing");
        canvas.isDrawingMode = true;
        
        // Configure brush again to ensure it's set up
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
        }
      }
    };
    
    canvas.on('mouse:down', handleMouseDown);
    
    // Add touch event handler for mobile
    const handleTouchStart = () => {
      if (tool === DrawingMode.DRAW && !canvas.isDrawingMode) {
        logger.warn("Drawing mode not properly set on touch, fixing");
        canvas.isDrawingMode = true;
        
        // Configure brush again
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
        }
      }
    };
    
    if (canvas.upperCanvasEl) {
      canvas.upperCanvasEl.addEventListener('touchstart', handleTouchStart);
    }
    
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      if (canvas.upperCanvasEl) {
        canvas.upperCanvasEl.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [canvas, tool, lineColor, lineThickness]);
  
  // Effect to check and fix issues periodically
  useEffect(() => {
    if (!canvas) return;
    
    const checkInterval = setInterval(() => {
      if (!canvas) return;
      
      // Verify drawing mode matches expected state
      if (tool === DrawingMode.DRAW && !canvas.isDrawingMode) {
        logger.warn("Drawing mode lost, restoring");
        canvas.isDrawingMode = true;
        
        // Reconfigure brush
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
        }
        
        canvas.requestRenderAll();
      }
      
      // Check if tool changed
      if (lastToolRef.current !== tool) {
        logger.info(`Tool changed from ${lastToolRef.current} to ${tool}, updating`);
        lastToolRef.current = tool;
      }
    }, 3000);
    
    return () => clearInterval(checkInterval);
  }, [canvas, tool, lineColor, lineThickness]);
  
  return null; // Non-visual component
};

export default CanvasDrawingEnhancer;
