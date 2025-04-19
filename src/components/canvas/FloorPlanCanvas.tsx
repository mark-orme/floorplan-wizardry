
/**
 * Floor Plan Canvas component
 * Handles canvas rendering and initialization
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { RootCanvasProvider } from './RootCanvasProvider';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import { toast } from 'sonner';
import '@/styles/canvas-mobile.css';
import { setCanvasDimensions } from '@/utils/fabric';

interface FloorPlanCanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  className?: string;
}

/**
 * FloorPlanCanvas component with enhanced reliability and mobile support
 * Provides a robust canvas interface with grid and drawing tools
 */
export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onError,
  tool = DrawingMode.SELECT,
  lineColor = "#000000",
  lineThickness = 2,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [initAttempts, setInitAttempts] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const maxAttempts = 3;
  
  // Create Fabric.js canvas
  const createCanvas = useCallback(() => {
    if (!canvasRef.current || fabricCanvas) return;
    
    try {
      // Create Fabric canvas instance with safety checks
      if (!canvasRef.current.getContext) {
        throw new Error('Canvas context not available');
      }
      
      // Create Fabric canvas instance
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
        renderOnAddRemove: true,
        selection: true,
        fireRightClick: false
      });
      
      // Check if canvas was properly initialized
      if (!canvas.getContext) {
        throw new Error('Canvas initialization failed - context not available');
      }
      
      setFabricCanvas(canvas);
      setCanvasReady(true);
      logger.info("Fabric canvas created successfully");
      
      return canvas;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error("Error creating canvas:", 
        error instanceof Error ? error : new Error(errorMessage),
        { width, height, attempt: initAttempts }
      );
      
      if (onError && error instanceof Error) {
        onError(error);
      }
      
      if (initAttempts >= maxAttempts) {
        toast.error("Failed to initialize canvas after multiple attempts");
      }
      
      return null;
    }
  }, [canvasRef, fabricCanvas, width, height, initAttempts, onError, maxAttempts]);
  
  // Initialize canvas effect
  useEffect(() => {
    if (fabricCanvas || !canvasRef.current || initAttempts >= maxAttempts) return;
    
    logger.info(`Initializing FloorPlanCanvas (attempt ${initAttempts + 1}/${maxAttempts})`);
    const canvas = createCanvas();
    
    if (!canvas && initAttempts < maxAttempts) {
      // Schedule retry with exponential backoff
      const retryDelay = Math.min(1000 * Math.pow(1.5, initAttempts), 5000);
      const timerId = setTimeout(() => {
        setInitAttempts(prev => prev + 1);
      }, retryDelay);
      
      return () => clearTimeout(timerId);
    }
    
    return () => {
      if (fabricCanvas) {
        logger.info("Disposing canvas on unmount");
        fabricCanvas.dispose();
      }
    };
  }, [createCanvas, fabricCanvas, initAttempts, maxAttempts]);
  
  // Handle canvas ready callback
  const handleCanvasReady = useCallback((canvas: FabricCanvas) => {
    setCanvasReady(true);
    logger.info("Canvas ready callback triggered");
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [onCanvasReady]);
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="border border-gray-200 rounded shadow-sm"
        data-testid="floorplan-canvas"
        width={width}
        height={height}
      />
      
      {fabricCanvas && (
        <RootCanvasProvider
          canvas={fabricCanvas}
          setCanvas={setFabricCanvas}
          tool={tool}
          lineColor={lineColor}
          lineThickness={lineThickness}
          onCanvasReady={handleCanvasReady}
        />
      )}
      
      {initAttempts > 0 && !canvasReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center p-4 bg-white shadow-md rounded-md">
            <p className="text-orange-600 font-medium">Canvas is initializing...</p>
            <p className="text-sm text-gray-600">Attempt {initAttempts} of {maxAttempts}</p>
            <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300" 
                style={{ width: `${Math.min(100, (initAttempts / maxAttempts) * 100)}%` }}
              ></div>
            </div>
            {initAttempts >= maxAttempts && (
              <button
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  setInitAttempts(0);
                  setFabricCanvas(null);
                  setCanvasReady(false);
                }}
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlanCanvas;
