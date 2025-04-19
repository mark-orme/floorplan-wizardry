
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { MobileCanvasOptimizer } from './MobileCanvasOptimizer';
import logger from '@/utils/logger';
import { setCanvasDimensions } from '@/utils/fabric';

interface RootCanvasProviderProps {
  canvas: FabricCanvas | null;
  setCanvas: (canvas: FabricCanvas | null) => void;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

export const RootCanvasProvider: React.FC<RootCanvasProviderProps> = ({
  canvas,
  setCanvas,
  tool = DrawingMode.SELECT,
  lineColor = '#000000',
  lineThickness = 2,
  onCanvasReady
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  
  // Initialize canvas when it becomes available
  useEffect(() => {
    if (!canvas) {
      return;
    }
    
    // Avoid re-initializing if already done
    if (isInitialized) {
      return;
    }
    
    const initializeCanvas = () => {
      try {
        // Log initialization attempt
        logger.info(`Initializing canvas (attempt ${initializationAttempts + 1})`);
        setInitializationAttempts(prev => prev + 1);
        
        // Apply tool settings safely - check for drawing brush first
        canvas.isDrawingMode = tool === DrawingMode.DRAW;
        canvas.selection = tool === DrawingMode.SELECT;
        
        // Only set brush properties if drawing brush exists and we're in drawing mode
        if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
        }
        
        // Set initialized state
        setIsInitialized(true);
        
        // Call onCanvasReady callback
        if (onCanvasReady) {
          onCanvasReady(canvas);
        }
        
        return true;
      } catch (error) {
        logger.error('Canvas failed to initialize properly', { 
          error: error instanceof Error ? error.message : 'Unknown error',
          tool, 
          initAttempt: initializationAttempts + 1 
        });
        return false;
      }
    };
    
    // Try to initialize
    const initSuccess = initializeCanvas();
    
    // If failed, retry after a delay (only up to 3 attempts)
    if (!initSuccess && initializationAttempts < 3) {
      const retryDelay = Math.pow(2, initializationAttempts) * 500; // Exponential backoff
      logger.info(`Scheduling canvas initialization retry in ${retryDelay}ms`);
      
      const timerId = setTimeout(() => {
        if (canvas) {
          initializeCanvas();
        }
      }, retryDelay);
      
      return () => clearTimeout(timerId);
    }
    
  }, [canvas, isInitialized, tool, lineColor, lineThickness, onCanvasReady, initializationAttempts]);
  
  // Handle tool changes when canvas is already initialized
  useEffect(() => {
    if (!canvas || !isInitialized) return;
    
    try {
      // Apply tool settings
      canvas.isDrawingMode = tool === DrawingMode.DRAW;
      canvas.selection = tool === DrawingMode.SELECT;
      
      if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
      }
      
      // Force render to apply changes
      canvas.requestRenderAll();
    } catch (error) {
      logger.error('Error changing canvas tool', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        prevTool: canvas.isDrawingMode ? 'DRAW' : 'SELECT', 
        newTool: tool 
      });
    }
  }, [canvas, isInitialized, tool, lineColor, lineThickness]);
  
  // Apply mobile-specific optimizations
  return canvas && isInitialized ? (
    <MobileCanvasOptimizer canvas={canvas} />
  ) : null;
};
