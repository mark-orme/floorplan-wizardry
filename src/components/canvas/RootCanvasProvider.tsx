
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { MobileCanvasOptimizer } from './MobileCanvasOptimizer';
import logger from '@/utils/logger';
import { logCanvasInitialization } from '@/utils/canvas/canvasErrorDiagnostics';

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
        
        // Check if drawing brush is available
        if (!canvas.freeDrawingBrush) {
          logger.canvasError('Drawing brush not available', 
            new Error('Canvas free drawing brush is undefined'),
            { tool, initAttempt: initializationAttempts + 1 }
          );
          return false;
        }
        
        // Apply tool settings
        canvas.isDrawingMode = tool === DrawingMode.DRAW;
        canvas.selection = tool === DrawingMode.SELECT;
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
        
        // Run validation and diagnostics
        logCanvasInitialization(
          canvas.getElement() as HTMLCanvasElement, 
          canvas,
          { tool, lineColor, lineThickness, initAttempt: initializationAttempts + 1 }
        );
        
        // Set initialized state
        setIsInitialized(true);
        
        // Call onCanvasReady callback
        if (onCanvasReady) {
          onCanvasReady(canvas);
        }
        
        return true;
      } catch (error) {
        logger.canvasError('Canvas failed to initialize properly', 
          error instanceof Error ? error : new Error('Unknown error'),
          { tool, initAttempt: initializationAttempts + 1 }
        );
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
      
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
      } else {
        logger.warn('Drawing brush not available on tool change', { tool });
      }
      
      // Force render to apply changes
      canvas.renderAll();
    } catch (error) {
      logger.canvasError('Error changing canvas tool', 
        error instanceof Error ? error : new Error('Unknown error'),
        { prevTool: canvas.isDrawingMode ? 'DRAW' : 'SELECT', newTool: tool }
      );
    }
  }, [canvas, isInitialized, tool, lineColor, lineThickness]);
  
  // Apply mobile-specific optimizations
  return canvas && isInitialized ? (
    <MobileCanvasOptimizer canvas={canvas} />
  ) : null;
};
