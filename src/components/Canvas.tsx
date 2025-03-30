
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { useCanvasContext } from "@/contexts/CanvasContext";
import { BasicGrid } from "./BasicGrid";

interface CanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: () => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const { setCanvas } = useCanvasContext();
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
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
      
      // Set actual canvas element size to match parent container
      const containerWidth = fabricCanvas.wrapperEl?.clientWidth || window.innerWidth;
      const containerHeight = fabricCanvas.wrapperEl?.clientHeight || window.innerHeight - 200;
      
      if (containerWidth && containerHeight && (width < 600 || height < 400)) {
        console.log(`Adjusting canvas dimensions to match container: ${containerWidth}x${containerHeight}`);
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
      fabricCanvas.isDrawingMode = false; // Start in selection mode by default
      
      // Configure necessary canvas event options for proper tool handling
      fabricCanvas.selection = true;
      fabricCanvas.hoverCursor = 'move';
      
      // Mark canvas as initialized for grid tools
      (fabricCanvas as any).initialized = true;
      
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
        fabricCanvas.dispose();
        fabricCanvasRef.current = null;
        setCanvas(null);
      };
    } catch (error) {
      console.error("Error initializing canvas:", error);
      if (onError) {
        onError();
      }
    }
  }, [width, height, setCanvas, onCanvasReady, onError]);
  
  return (
    <div className="w-full h-full relative overflow-hidden" data-testid="canvas-wrapper">
      <canvas
        ref={canvasRef}
        id="fabric-canvas"
        className="border border-gray-200 rounded"
        data-testid="canvas-element"
      />
      {fabricCanvasRef.current && (
        <BasicGrid 
          fabricCanvas={fabricCanvasRef.current}
          debugMode={true}
        />
      )}
    </div>
  );
};
