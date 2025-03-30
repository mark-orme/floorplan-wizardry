
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
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
      
      // Initialize Fabric.js canvas
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#FFFFFF",
        selection: true,
        preserveObjectStacking: true
      });
      
      // Store the canvas in ref for component internal use
      fabricCanvasRef.current = fabricCanvas;
      
      // Set up drawing brush - ensure initialization is done properly
      if (fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.color = "#000000";
        fabricCanvas.freeDrawingBrush.width = 2;
        fabricCanvas.isDrawingMode = false; // Start in selection mode by default
      }
      
      // Update context
      setCanvas(fabricCanvas);
      
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
