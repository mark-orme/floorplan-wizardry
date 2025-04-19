
import React, { useState, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import SimpleGridLayer from './SimpleGridLayer';
import { MobileCanvasEnhancer } from './MobileCanvasEnhancer';
import { CanvasDrawingEnhancer } from './CanvasDrawingEnhancer';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import { toast } from 'sonner';
import { captureMessage } from '@/utils/sentry';

interface RootCanvasProviderProps {
  canvas: FabricCanvas | null;
  setCanvas?: (canvas: FabricCanvas | null) => void;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  children?: React.ReactNode;
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

/**
 * Root provider that coordinates all canvas enhancements
 * Ensures reliability through multiple layers of redundancy
 */
export const RootCanvasProvider: React.FC<RootCanvasProviderProps> = ({
  canvas,
  setCanvas,
  tool = DrawingMode.SELECT,
  lineColor = "#000000",
  lineThickness = 2,
  children,
  onCanvasReady
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const initAttemptsRef = useRef(0);
  
  // Initialize monitoring state
  useEffect(() => {
    if (!canvas) return;
    
    logger.info("RootCanvasProvider: Initializing");
    
    // Set up global canvas state for monitoring
    if (typeof window !== 'undefined') {
      window.__canvas_state = window.__canvas_state || {};
      if (window.__canvas_state) {
        window.__canvas_state.canvasInitialized = true;
        window.__canvas_state.initTime = Date.now();
      }
    }
    
    // Initialize the canvas systems
    const initializeCanvas = () => {
      try {
        logger.info("Starting canvas subsystems initialization");
        
        // Ensure canvas is ready
        if (!canvas.wrapperEl || !canvas.upperCanvasEl) {
          initAttemptsRef.current += 1;
          
          if (initAttemptsRef.current < 5) {
            logger.warn(`Canvas not fully initialized, retry ${initAttemptsRef.current}/5`);
            setTimeout(initializeCanvas, 300);
            return;
          } else {
            logger.error("Canvas failed to initialize properly");
            captureMessage('Canvas failed to initialize properly', 'canvas-init', {
              level: 'error',
              tags: { 
                component: 'RootCanvasProvider',
                attempts: String(initAttemptsRef.current)
              }
            });
            toast.error("Canvas initialization failed. Please refresh the page.");
            return;
          }
        }
        
        // Configure base canvas settings
        canvas.selection = tool === DrawingMode.SELECT;
        canvas.isDrawingMode = tool === DrawingMode.DRAW;
        canvas.preserveObjectStacking = true;
        
        // Call onCanvasReady callback
        if (onCanvasReady && !isInitialized) {
          onCanvasReady(canvas);
        }
        
        setIsInitialized(true);
        logger.info("Canvas initialized successfully");
        
        // Update canvas reference if setCanvas is provided
        if (setCanvas) {
          setCanvas(canvas);
        }
      } catch (error) {
        logger.error("Error during canvas initialization:", error);
        captureMessage('Error during canvas initialization', 'canvas-init', {
          level: 'error',
          tags: { component: 'RootCanvasProvider' },
          extra: { error: String(error) }
        });
      }
    };
    
    // Start initialization
    initializeCanvas();
    
    return () => {
      // Cleanup when component unmounts
      if (typeof window !== 'undefined' && window.__canvas_state) {
        window.__canvas_state.canvasInitialized = false;
      }
      
      logger.info("RootCanvasProvider: Cleaning up");
    };
  }, [canvas, onCanvasReady, isInitialized, setCanvas, tool]);
  
  if (!canvas) {
    return <>{children}</>;
  }
  
  return (
    <>
      {/* Grid Layer - ensures grid visibility */}
      <SimpleGridLayer canvas={canvas} />
      
      {/* Mobile Enhancements - specifically for mobile devices */}
      <MobileCanvasEnhancer canvas={canvas} />
      
      {/* Drawing Enhancements - ensures drawing tools work */}
      <CanvasDrawingEnhancer 
        canvas={canvas}
        tool={tool}
        lineColor={lineColor}
        lineThickness={lineThickness}
      />
      
      {/* Render children */}
      {children}
    </>
  );
};

export default RootCanvasProvider;
