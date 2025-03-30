
import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { toast } from "sonner";
import { useUnifiedGridManagement } from "@/hooks/useUnifiedGridManagement";
import { DrawingMode } from "@/constants/drawingModes";

interface EnhancedCanvasProps {
  width?: number;
  height?: number;
  tool?: DrawingMode;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
}

export const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({
  width = 800,
  height = 600,
  tool = DrawingMode.SELECT,
  onCanvasReady,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [dimensions, setDimensions] = useState({ width, height });
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Use our unified grid management
  const { 
    gridLayerRef, 
    createGrid, 
    checkAndFixGrid, 
    forceGridCreation 
  } = useUnifiedGridManagement({
    fabricCanvasRef,
    canvasDimensions: dimensions,
    zoomLevel
  });
  
  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      console.log("Initializing Fabric canvas with dimensions", width, "x", height);
      
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
      
      // Store the canvas in ref
      fabricCanvasRef.current = fabricCanvas;
      
      // Ensure drawing brush is properly initialized
      if (!fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
      }
      
      // Set up drawing brush
      fabricCanvas.freeDrawingBrush.color = "#000000";
      fabricCanvas.freeDrawingBrush.width = 2;
      fabricCanvas.isDrawingMode = tool === DrawingMode.DRAW;
      
      // Mark canvas as initialized for grid tools
      (fabricCanvas as any).initialized = true;
      
      // Add zoom event listener
      fabricCanvas.on('zoom:changed', (opt: any) => {
        setZoomLevel(fabricCanvas.getZoom());
      });
      
      // Force initial render
      fabricCanvas.requestRenderAll();
      
      // Create grid with a small delay
      setTimeout(() => {
        createGrid();
      }, 100);
      
      // Notify parent component
      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }
      
      // Success toast
      toast.success("Canvas initialized successfully");
      
      // Clean up function
      return () => {
        fabricCanvas.dispose();
        fabricCanvasRef.current = null;
      };
    } catch (error) {
      console.error("Error initializing canvas:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
      toast.error("Failed to initialize canvas");
    }
  }, [width, height, onCanvasReady, onError, createGrid, tool]);
  
  // Handle tool changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Reset canvas modes
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    // Apply tool-specific settings
    switch (tool) {
      case DrawingMode.SELECT:
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        break;
        
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = "#000000";
        canvas.freeDrawingBrush.width = 2;
        canvas.defaultCursor = 'crosshair';
        break;
        
      case DrawingMode.WALL:
      case DrawingMode.ROOM:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        break;
        
      case DrawingMode.HAND:
        canvas.defaultCursor = 'grab';
        canvas.hoverCursor = 'grab';
        break;
        
      case DrawingMode.ERASER:
        canvas.defaultCursor = 'cell';
        canvas.hoverCursor = 'cell';
        break;
    }
    
    // Ensure grid stays at the bottom after tool change
    checkAndFixGrid();
    
  }, [tool, checkAndFixGrid]);
  
  // Manage responsive dimensions if needed
  useEffect(() => {
    if (width !== dimensions.width || height !== dimensions.height) {
      setDimensions({ width, height });
      
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.setWidth(width);
        fabricCanvasRef.current.setHeight(height);
        fabricCanvasRef.current.requestRenderAll();
        
        // Recreate grid when dimensions change
        forceGridCreation();
      }
    }
  }, [width, height, dimensions, forceGridCreation]);
  
  return (
    <div className="w-full h-full relative overflow-hidden" data-testid="canvas-wrapper">
      <canvas
        ref={canvasRef}
        id="fabric-canvas"
        className="border border-gray-200 rounded"
        data-testid="canvas-element"
      />
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        {Math.round(zoomLevel * 100)}%
      </div>
    </div>
  );
};
