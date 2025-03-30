
/**
 * Canvas Component
 * Responsible for rendering the fabric.js canvas with grid
 */
import React, { useRef, useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { useCanvasContext } from "@/contexts/CanvasContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { CANVAS_CONSTANTS } from "@/constants/canvasConstants";
import { ERROR_MESSAGES } from "@/constants/errorMessages";
import { useSimpleGrid } from "@/hooks/useSimpleGrid";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { useGridDiagnosticLogger } from "@/hooks/useGridDiagnosticLogger";
import logger from "@/utils/logger";
import { BasicGrid } from "@/components/BasicGrid";
import { DistanceTooltip } from "@/components/DistanceTooltip";
import { snapToGrid, snapToAngle } from "@/utils/grid/snapping";
import { Point } from "@/types/geometryTypes";

interface CanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  width = CANVAS_CONSTANTS.DEFAULT_WIDTH,
  height = CANVAS_CONSTANTS.DEFAULT_HEIGHT,
  backgroundColor = CANVAS_CONSTANTS.DEFAULT_BACKGROUND_COLOR,
  onCanvasReady,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<Error | null>(null);
  const [initAttempts, setInitAttempts] = useState(0);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const { setCanvas } = useCanvasContext();
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === 'development');
  const [currentMeasurement, setCurrentMeasurement] = useState<{
    start: Point;
    end: Point;
    distance: number;
    visible: boolean;
  }>({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    distance: 0,
    visible: false
  });
  
  // Use our simple grid hook
  const { 
    gridCreated, 
    objectCount, 
    creationAttempts, 
    createGrid, 
    clearGrid,
    gridLayerRef
  } = useSimpleGrid(fabricCanvas, { showToasts: true });
  
  // Add grid diagnostic logging
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  useGridDiagnosticLogger(fabricCanvasRef, gridLayerRef);

  // Reset initialization state and set up debug key combo
  useEffect(() => {
    resetInitializationState();
    
    // Toggle debug panel with Alt+G
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'g') {
        setShowDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle drawing events for snap-to-grid and measurements
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Function to convert event coordinates to canvas coordinates
    const getCanvasPoint = (e: MouseEvent): Point => {
      const canvasElement = fabricCanvas.getElement();
      const rect = canvasElement.getBoundingClientRect();
      const zoom = fabricCanvas.getZoom();
      
      return {
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom
      };
    };
    
    // Track start point for current drawing
    let startPoint: Point | null = null;
    
    // Mouse down handler - start drawing and set start point
    const handleMouseDown = (e: any) => {
      if (!fabricCanvas.isDrawingMode) return;
      
      const canvasPoint = getCanvasPoint(e.e);
      startPoint = snapToGrid(canvasPoint); // Snap to grid on drawing start
      
      // Reset measurement
      setCurrentMeasurement({
        start: startPoint,
        end: startPoint,
        distance: 0,
        visible: true
      });
    };
    
    // Mouse move handler - update drawing and measurements
    const handleMouseMove = (e: any) => {
      if (!fabricCanvas.isDrawingMode || !startPoint) return;
      
      // Get current point and snap to grid
      const canvasPoint = getCanvasPoint(e.e);
      const snappedPoint = snapToGrid(canvasPoint);
      
      // Calculate distance for measurement tooltip
      const dx = snappedPoint.x - startPoint.x;
      const dy = snappedPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Update measurement
      setCurrentMeasurement({
        start: startPoint,
        end: snappedPoint,
        distance,
        visible: true
      });
    };
    
    // Mouse up handler - finalize drawing and hide measurement
    const handleMouseUp = () => {
      // Hide measurement after drawing is complete
      setTimeout(() => {
        setCurrentMeasurement(prev => ({
          ...prev,
          visible: false
        }));
      }, 1000);
      
      startPoint = null;
    };
    
    // Register event handlers
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    
    // Cleanup handlers on unmount
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('mouse:down', handleMouseDown);
        fabricCanvas.off('mouse:move', handleMouseMove);
        fabricCanvas.off('mouse:up', handleMouseUp);
      }
    };
  }, [fabricCanvas]);

  // Canvas initialization effect with improved error handling
  useEffect(() => {
    const initCanvas = (): void => {
      try {
        if (!canvasRef.current) {
          throw new Error(ERROR_MESSAGES.CANVAS_ELEMENT_NOT_FOUND);
        }

        console.log("Initializing canvas with dimensions:", width, height);

        // Create fabric.js canvas with explicit dimensions
        const canvas = new FabricCanvas(canvasRef.current, {
          width,
          height,
          backgroundColor,
          selection: true,
          preserveObjectStacking: true
        });

        // Set dimensions again to ensure they're applied
        canvas.setDimensions({ width, height });
        
        // Set free drawing brush options
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = CANVAS_CONSTANTS.DEFAULT_BRUSH_COLOR;
          canvas.freeDrawingBrush.width = CANVAS_CONSTANTS.DEFAULT_BRUSH_WIDTH;
        }

        // Store the canvas reference in both state and ref
        setFabricCanvas(canvas);
        setCanvas(canvas);
        fabricCanvasRef.current = canvas;

        // Notify parent component
        if (onCanvasReady) {
          onCanvasReady(canvas);
        }

        logger.info("Canvas initialized successfully");
        console.log("Canvas initialized successfully", { 
          width: canvas.width, 
          height: canvas.height 
        });

      } catch (err) {
        const error = err instanceof Error ? err : new Error(ERROR_MESSAGES.CANVAS_INIT_FAILED);
        logger.error("Canvas initialization error:", error);
        console.error("Canvas initialization error:", error);
        setError(error);
        
        if (onError) {
          onError(error);
        }
      }
    };

    // Initialize canvas
    initCanvas();

    // Cleanup function to properly dispose canvas
    return () => {
      if (fabricCanvas) {
        try {
          fabricCanvas.dispose();
        } catch (err) {
          console.error("Error disposing canvas:", err);
        }
        setFabricCanvas(null);
        setCanvas(null);
        fabricCanvasRef.current = null;
      }
    };
  }, [width, height, backgroundColor, setCanvas, onCanvasReady, onError, initAttempts]);

  // Handle retry button click
  const handleRetry = (): void => {
    setError(null);
    setInitAttempts(prev => prev + 1);
    toast.info("Retrying canvas initialization...");
  };
  
  // Handle grid refresh
  const handleRefreshGrid = (): void => {
    if (fabricCanvas) {
      // Clear first then create new grid
      clearGrid();
      setTimeout(() => {
        logger.info("Manual grid refresh requested");
        createGrid();
      }, 100);
      
      toast.success("Refreshing grid...");
    }
  };

  // Render error state if initialization fails
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-50 border border-gray-200 rounded-md p-4">
        <p className="text-red-500 mb-4">
          {error.message || ERROR_MESSAGES.CANVAS_INIT_FAILED}
        </p>
        <Button onClick={handleRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  // Render canvas with debug info
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="border border-gray-200 rounded-lg shadow-lg max-w-full"
        data-testid="canvas"
      />
      
      {/* Add our BasicGrid component */}
      <BasicGrid fabricCanvas={fabricCanvas} />
      
      {/* Add measurement tooltip */}
      {currentMeasurement.visible && (
        <DistanceTooltip
          startPoint={currentMeasurement.start}
          endPoint={currentMeasurement.end}
          distance={currentMeasurement.distance}
          visible={currentMeasurement.visible}
        />
      )}
      
      {showDebug && fabricCanvas && (
        <div className="absolute top-2 right-2 bg-white/95 p-3 rounded shadow text-xs z-10">
          <div className="font-bold mb-1">Grid Status</div>
          <div>Grid created: {gridCreated ? 'Yes' : 'No'}</div>
          <div>Grid objects: {objectCount}</div>
          <div>Creation attempts: {creationAttempts}</div>
          <Button 
            size="sm"
            variant="outline"
            className="mt-2 text-xs h-7 px-2"
            onClick={handleRefreshGrid}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh Grid
          </Button>
        </div>
      )}
      
      {!showDebug && fabricCanvas && !gridCreated && (
        <Button 
          size="sm"
          variant="outline"
          className="absolute top-2 right-2 text-xs z-10"
          onClick={createGrid}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Create Grid
        </Button>
      )}
    </div>
  );
};
