
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { RootCanvasProvider } from './RootCanvasProvider';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import { toast } from 'sonner';
import { captureMessage } from '@/utils/sentry';
import '../styles/canvas-mobile.css';

interface FloorPlanCanvasProps {
  width: number;
  height: number;
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
  width,
  height,
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
  
  // Create Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvas) return;
    
    logger.info(`Initializing FloorPlanCanvas: ${width}x${height}`);
    
    const createCanvas = () => {
      try {
        const canvas = new FabricCanvas(canvasRef.current, {
          width,
          height,
          backgroundColor: '#ffffff',
          preserveObjectStacking: true,
          renderOnAddRemove: true,
          selection: true,
          fireRightClick: false
        });
        
        setFabricCanvas(canvas);
        logger.info("Fabric canvas created successfully");
        
        // Set canvas data attributes for easy testing/debugging
        if (canvasRef.current.parentElement) {
          canvasRef.current.parentElement.setAttribute('data-canvas-ready', 'true');
          canvasRef.current.parentElement.setAttribute('data-testid', 'floor-plan-wrapper');
        }
        
        return () => {
          logger.info("Disposing canvas on unmount");
          canvas.dispose();
          setFabricCanvas(null);
        };
      } catch (error) {
        logger.error("Error creating canvas:", error);
        
        // Report to Sentry
        captureMessage('Error creating Fabric canvas', 'canvas-creation-error', {
          level: 'error',
          extra: { error: String(error), dimensions: `${width}x${height}` }
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
        onCanvasReady={onCanvasReady}
      />
    </div>
  );
};

export default FloorPlanCanvas;
