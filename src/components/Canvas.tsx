
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { useCanvasContext } from "@/contexts/CanvasContext";
import { createReliableGrid } from "@/utils/grid/simpleGridCreator";
import { toast } from "sonner";
import logger from "@/utils/logger";
import { DrawingMode } from "@/constants/drawingModes";

interface CanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: () => void;
  initialTool?: DrawingMode;
}

export const Canvas: React.FC<CanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onError,
  initialTool = DrawingMode.SELECT
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridObjectsRef = useRef<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { setCanvas } = useCanvasContext();
  
  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;
    
    try {
      logger.info("Canvas component: Initializing Fabric canvas with dimensions", width, "x", height);
      console.log("Canvas component: Initializing Fabric canvas with dimensions", width, "x", height);
      
      // Initialize Fabric.js canvas with proper dimensions
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#FFFFFF",
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true,
        stopContextMenu: true
      });
      
      // Store the canvas in ref for component internal use
      fabricCanvasRef.current = fabricCanvas;
      
      // Ensure actual canvas element size matches container
      const containerWidth = fabricCanvas.wrapperEl?.clientWidth || width;
      const containerHeight = fabricCanvas.wrapperEl?.clientHeight || height;
      
      if (containerWidth && containerHeight && (width !== containerWidth || height !== containerHeight)) {
        logger.info(`Adjusting canvas dimensions to match container: ${containerWidth}x${containerHeight}`);
        fabricCanvas.setWidth(containerWidth);
        fabricCanvas.setHeight(containerHeight);
      }
      
      // Ensure drawing brush is properly initialized
      if (!fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
      }
      
      // Set up drawing brush - ensure initialization is done properly
      fabricCanvas.freeDrawingBrush.color = "#000000";
      fabricCanvas.freeDrawingBrush.width = 2;
      fabricCanvas.isDrawingMode = initialTool === DrawingMode.DRAW;
      
      // Configure necessary canvas event options for proper tool handling
      fabricCanvas.selection = initialTool === DrawingMode.SELECT;
      fabricCanvas.hoverCursor = 'move';
      
      // Create grid directly here to ensure it's initialized early
      setTimeout(() => {
        if (fabricCanvas) {
          try {
            logger.info("Creating initial grid");
            const gridObjects = createReliableGrid(fabricCanvas, gridObjectsRef);
            logger.info(`Created ${gridObjects.length} grid objects`);
            console.log(`Created ${gridObjects.length} grid objects`);
            
            // Force render after grid creation
            fabricCanvas.requestRenderAll();
          } catch (error) {
            logger.error("Failed to create initial grid:", error);
            console.error("Failed to create initial grid:", error);
          }
        }
      }, 100);
      
      // Mark canvas as initialized for grid tools
      (fabricCanvas as any).initialized = true;
      setIsInitialized(true);
      
      // Update context
      setCanvas(fabricCanvas);
      
      // Force initial render to ensure all setup is displayed
      fabricCanvas.requestRenderAll();
      
      // Notify parent component
      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }
      
      // Clean up function
      return () => {
        logger.info("Disposing fabric canvas");
        try {
          fabricCanvas.dispose();
          fabricCanvasRef.current = null;
          setCanvas(null);
          setIsInitialized(false);
        } catch (disposeError) {
          logger.error("Error disposing canvas:", disposeError);
        }
      };
    } catch (error) {
      logger.error("Error initializing canvas:", error);
      console.error("Error initializing canvas:", error);
      if (onError) {
        onError();
      }
    }
  }, [width, height, setCanvas, onCanvasReady, onError, initialTool, isInitialized]);
  
  // Update canvas dimensions if they change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas && isInitialized && (canvas.width !== width || canvas.height !== height)) {
      logger.info(`Updating canvas dimensions to ${width}x${height}`);
      
      try {
        canvas.setWidth(width);
        canvas.setHeight(height);
        canvas.requestRenderAll();
        
        // Recreate grid after dimension change
        setTimeout(() => {
          if (canvas) {
            try {
              const gridObjects = createReliableGrid(canvas, gridObjectsRef);
              logger.info(`Recreated ${gridObjects.length} grid objects after resize`);
            } catch (error) {
              logger.error("Failed to recreate grid after resize:", error);
            }
          }
        }, 100);
      } catch (error) {
        logger.error("Error updating canvas dimensions:", error);
      }
    }
  }, [width, height, isInitialized]);
  
  return (
    <div className="w-full h-full relative overflow-hidden" data-testid="canvas-wrapper">
      <canvas
        ref={canvasRef}
        id="fabric-canvas"
        className="border border-gray-200 rounded"
        data-testid="canvas-element"
        data-canvas-ready={isInitialized ? "true" : "false"}
      />
    </div>
  );
};
