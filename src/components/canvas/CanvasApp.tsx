
import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { useCanvasController } from "./controller/CanvasController";
import { createSimpleGrid } from "@/utils/simpleGridCreator";

interface CanvasAppProps {
  createGrid?: (canvas: FabricCanvas, existingGrid?: FabricObject[]) => FabricObject[];
}

export const CanvasApp: React.FC<CanvasAppProps> = ({ createGrid }) => {
  const { canvas, setCanvas } = useCanvasController();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridObjectsRef = useRef<FabricObject[]>([]);
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      console.log("Initializing canvas in CanvasApp");
      
      // Create fabric canvas
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: "#FFFFFF",
        isDrawingMode: true,
        selection: true
      });
      
      // Set canvas in context
      setCanvas(fabricCanvas);
      
      // Set up drawing brush
      fabricCanvas.freeDrawingBrush.color = '#000000';
      fabricCanvas.freeDrawingBrush.width = 2;
      
      // Create grid using the provided function or default
      const gridCreator = createGrid || createSimpleGrid;
      const gridObjects = gridCreator(fabricCanvas);
      gridObjectsRef.current = gridObjects;
      
      console.log(`Created ${gridObjects.length} grid objects`);
      
      // Force render
      fabricCanvas.requestRenderAll();
      
      toast.success("Canvas initialized with grid");
      
      // Cleanup on unmount
      return () => {
        fabricCanvas.dispose();
        setCanvas(null);
      };
    } catch (error) {
      console.error("Error initializing canvas:", error);
      toast.error("Error initializing canvas");
    }
  }, [setCanvas, createGrid]);
  
  // Update drawing mode when it changes
  useEffect(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = isDrawingMode;
    
    if (isDrawingMode) {
      toast.info("Drawing mode enabled");
    } else {
      toast.info("Selection mode enabled");
    }
  }, [canvas, isDrawingMode]);
  
  // Handle toggle drawing mode
  const toggleDrawingMode = () => {
    setIsDrawingMode(prev => !prev);
  };
  
  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Canvas</h2>
        
        <div className="flex gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm ${isDrawingMode ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={toggleDrawingMode}
          >
            {isDrawingMode ? 'Drawing Mode' : 'Selection Mode'}
          </button>
        </div>
      </div>
      
      <div className="border border-gray-300 rounded shadow-sm bg-white flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          data-testid="fabric-canvas"
        />
      </div>
    </div>
  );
};
