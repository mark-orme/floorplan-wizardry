
import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { useCanvasController } from "./controller/CanvasController";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils";
import { initializeDrawingBrush } from "@/utils/fabricBrush";
import { DrawingMode } from "@/constants/drawingModes";
import { DrawingToolbar } from "../DrawingToolbar";

interface CanvasAppProps {
  createGrid?: (canvas: FabricCanvas, existingGrid?: FabricObject[]) => FabricObject[];
}

export const CanvasApp: React.FC<CanvasAppProps> = ({ createGrid }) => {
  const { canvas, setCanvas } = useCanvasController();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridObjectsRef = useRef<FabricObject[]>([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineThickness, setLineThickness] = useState(2);
  const [lineColor, setLineColor] = useState("#000000");
  
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
        isDrawingMode: false,
        selection: true
      });
      
      // Set canvas in context
      setCanvas(fabricCanvas);
      
      // Set up drawing brush (moved after canvas creation)
      const brush = initializeDrawingBrush(fabricCanvas);
      
      // Set brush properties
      brush.color = lineColor;
      brush.width = lineThickness;
      
      // Create grid using the provided function or default
      const gridCreator = createGrid || createBasicEmergencyGrid;
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
  }, [setCanvas, createGrid, lineColor, lineThickness]);
  
  // Update drawing mode when tool changes
  useEffect(() => {
    if (!canvas) return;
    
    // Set drawing mode based on active tool
    const newIsDrawingMode = activeTool === DrawingMode.DRAW;
    canvas.isDrawingMode = newIsDrawingMode;
    setIsDrawingMode(newIsDrawingMode);
    
    // Update brush properties if in drawing mode
    if (newIsDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    toast.info(`Tool set to: ${activeTool}`);
  }, [canvas, activeTool, lineColor, lineThickness]);
  
  // Handle tool change
  const handleToolChange = (tool: DrawingMode) => {
    setActiveTool(tool);
  };
  
  // Handle line thickness change
  const handleLineThicknessChange = (thickness: number) => {
    setLineThickness(thickness);
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = thickness;
    }
  };
  
  // Handle line color change
  const handleLineColorChange = (color: string) => {
    setLineColor(color);
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
  };
  
  // Handle undo (placeholder)
  const handleUndo = () => {
    toast.info("Undo action");
  };
  
  // Handle redo (placeholder)
  const handleRedo = () => {
    toast.info("Redo action");
  };
  
  // Handle canvas clear
  const handleClear = () => {
    if (!canvas) return;
    
    // Remove all objects except grid
    const nonGridObjects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
    nonGridObjects.forEach(obj => canvas.remove(obj));
    
    canvas.renderAll();
    toast.success("Canvas cleared");
  };
  
  // Handle save (placeholder)
  const handleSave = () => {
    toast.success("Canvas saved");
  };
  
  // Handle delete selected
  const handleDelete = () => {
    if (!canvas) return;
    
    const selectedObjects = canvas.getActiveObjects();
    if (selectedObjects.length === 0) {
      toast.info("No objects selected");
      return;
    }
    
    // Remove selected objects
    canvas.remove(...selectedObjects);
    canvas.discardActiveObject();
    canvas.renderAll();
    
    toast.success(`Deleted ${selectedObjects.length} objects`);
  };
  
  // Handle zoom
  const handleZoom = (direction: "in" | "out") => {
    if (!canvas) return;
    
    const currentZoom = canvas.getZoom();
    let newZoom = direction === "in" ? currentZoom * 1.1 : currentZoom / 1.1;
    
    // Limit zoom range
    newZoom = Math.min(Math.max(0.5, newZoom), 3);
    
    canvas.setZoom(newZoom);
    toast.info(`Zoom: ${Math.round(newZoom * 100)}%`);
  };
  
  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full">
      <DrawingToolbar
        tool={activeTool}
        onToolChange={handleToolChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoom={handleZoom}
        onClear={handleClear}
        onSave={handleSave}
        onDelete={handleDelete}
        gia={0} // Placeholder for GIA calculation
        lineThickness={lineThickness}
        lineColor={lineColor}
        onLineThicknessChange={handleLineThicknessChange}
        onLineColorChange={handleLineColorChange}
      />
      
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
