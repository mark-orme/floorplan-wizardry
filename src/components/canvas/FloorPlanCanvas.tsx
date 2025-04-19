
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { RootCanvasProvider } from './RootCanvasProvider';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import { toast } from 'sonner';
import { captureMessage } from '@/utils/sentry';
import { logCanvasInitialization } from '@/utils/canvas/canvasErrorDiagnostics';
import '@/styles/canvas-mobile.css';

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
  const initAttemptsRef = useRef(0);
  const [canvasReady, setCanvasReady] = useState(false);
  
  // Create Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvas) return;
    
    logger.info(`Initializing FloorPlanCanvas: ${width}x${height}`);
    
    const createCanvas = () => {
      try {
        // Log initialization attempt
        const attemptNum = initAttemptsRef.current + 1;
        logger.info(`Creating canvas (attempt ${attemptNum})`, { 
          dimensions: `${width}x${height}`, 
          element: canvasRef.current ? 'exists' : 'missing' 
        });
        
        initAttemptsRef.current = attemptNum;
        
        if (!canvasRef.current) {
          throw new Error('Canvas reference is null');
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
        
        // Run validation
        logCanvasInitialization(
          canvasRef.current,
          canvas,
          { initAttempt: attemptNum, componentName: 'FloorPlanCanvas' }
        );
        
        setFabricCanvas(canvas);
        setCanvasReady(true);
        logger.info("Fabric canvas created successfully");
        
        // Set canvas data attributes for easy testing/debugging
        if (canvasRef.current.parentElement) {
          canvasRef.current.parentElement.setAttribute('data-canvas-ready', 'true');
          canvasRef.current.parentElement.setAttribute('data-testid', 'floor-plan-wrapper');
        }
        
        // Set global canvas state for debugging
        if (window.__canvas_state) {
          window.__canvas_state.canvasInitialized = true;
          window.__canvas_state.initTime = Date.now();
          window.__canvas_state.width = width;
          window.__canvas_state.height = height;
        }
        
        return () => {
          logger.info("Disposing canvas on unmount");
          canvas.dispose();
          setFabricCanvas(null);
          setCanvasReady(false);
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.canvasError("Error creating canvas:", 
          error instanceof Error ? error : new Error(errorMessage),
          { width, height, attempt: initAttemptsRef.current }
        );
        
        // Report to Sentry
        captureMessage('Error creating Fabric canvas', 'canvas-creation-error', {
          level: 'error',
          extra: { error: errorMessage, dimensions: `${width}x${height}` }
        });
        
        // Call onError if provided
        if (onError && error instanceof Error) {
          onError(error);
        }
        
        // Show user-facing error
        toast.error("Failed to initialize canvas. Please refresh the page.");
        
        // Retry canvas creation with exponential backoff
        initAttemptsRef.current += 1;
        if (initAttemptsRef.current <= 3) {
          const delay = Math.pow(2, initAttemptsRef.current - 1) * 500;
          logger.info(`Retrying canvas creation in ${delay}ms (attempt ${initAttemptsRef.current}/3)`);
          setTimeout(createCanvas, delay);
        }
        
        return () => {}; // No cleanup needed on error
      }
    };
    
    return createCanvas();
  }, [width, height, onError, fabricCanvas]);
  
  // Resize handler
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const handleResize = () => {
      // Only update dimensions if they've actually changed
      if (fabricCanvas.width !== width || fabricCanvas.height !== height) {
        logger.info(`Resizing canvas to ${width}x${height}`);
        fabricCanvas.setDimensions({ width, height });
      }
    };
    
    // Apply initial dimensions
    handleResize();
    
    // Set up resize event listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [fabricCanvas, width, height]);
  
  // Handle canvas ready callback
  const handleCanvasReady = (canvas: FabricCanvas) => {
    logger.info("Canvas ready callback triggered");
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  };
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="border border-gray-200 rounded shadow-sm"
        data-testid="floorplan-canvas"
      />
      
      <RootCanvasProvider
        canvas={fabricCanvas}
        setCanvas={setFabricCanvas}
        tool={tool}
        lineColor={lineColor}
        lineThickness={lineThickness}
        onCanvasReady={handleCanvasReady}
      />
      
      {initAttemptsRef.current > 0 && !canvasReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center p-4 bg-white shadow-md rounded-md">
            <p className="text-orange-600 font-medium">Canvas is initializing...</p>
            <p className="text-sm text-gray-600">Attempt {initAttemptsRef.current} of 3</p>
            <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300" 
                style={{ width: `${Math.min(100, initAttemptsRef.current * 33.3)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlanCanvas;
