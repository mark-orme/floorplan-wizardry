
import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Line, PencilBrush } from "fabric";
import { CanvasEventManager } from "./CanvasEventManager";
import { DrawingMode } from "@/constants/drawingModes";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { toast } from "sonner";

/**
 * Props for ConnectedDrawingCanvas component
 */
interface ConnectedDrawingCanvasProps {
  width?: number;
  height?: number;
  onCanvasRef?: (ref: any) => void;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
}

/**
 * Connected drawing canvas component
 * Manages canvas state and provides drawing functionality
 */
export const ConnectedDrawingCanvas: React.FC<ConnectedDrawingCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasRef,
  tool = DrawingMode.SELECT,
  lineColor = "#000000",
  lineThickness = 2
}) => {
  // Access drawing context
  const { 
    activeTool: contextTool, 
    lineColor: contextLineColor, 
    lineThickness: contextLineThickness 
  } = useDrawingContext();
  
  // Use props or context values
  const activeTool = tool || contextTool;
  const activeLineColor = lineColor || contextLineColor;
  const activeLineThickness = lineThickness || contextLineThickness;
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
  const operationsRef = useRef<any>(null);
  
  // State
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || initialized) return;
    
    try {
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        selection: activeTool === DrawingMode.SELECT,
        backgroundColor: "#ffffff"
      });
      
      setCanvas(fabricCanvas);
      setInitialized(true);
      
      // Create grid
      const gridObjects = createGrid(fabricCanvas);
      gridLayerRef.current = gridObjects;
      fabricCanvas.renderAll();
      
      // Clean up canvas on unmount
      return () => {
        fabricCanvas.dispose();
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to initialize canvas: ${errorMsg}`);
    }
  }, [width, height, activeTool, initialized]);

  // Create grid function
  const createGrid = (fabricCanvas: FabricCanvas) => {
    try {
      const gridSize = 20;
      const gridObjects: FabricObject[] = [];
      
      // Create horizontal grid lines
      for (let i = 0; i <= height; i += gridSize) {
        const lineProps = {
          stroke: "#e0e0e0",
          selectable: false,
          evented: false,
          objectType: "grid"
        };
        const line = new Line([0, i, width, i], lineProps as any);
        fabricCanvas.add(line);
        gridObjects.push(line);
      }
      
      // Create vertical grid lines
      for (let i = 0; i <= width; i += gridSize) {
        const lineProps = {
          stroke: "#e0e0e0",
          selectable: false,
          evented: false,
          objectType: "grid"
        };
        const line = new Line([i, 0, i, height], lineProps as any);
        fabricCanvas.add(line);
        gridObjects.push(line);
      }
      
      return gridObjects;
    } catch (error) {
      toast.error("Failed to create grid");
      return [];
    }
  };

  // Initialize the drawing brush when canvas is initialized
  useEffect(() => {
    if (canvas && initialized) {
      // Ensure the drawing brush is initialized
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new PencilBrush(canvas);
      }
      
      // Configure the brush
      canvas.freeDrawingBrush.color = activeLineColor;
      canvas.freeDrawingBrush.width = activeLineThickness;
    }
  }, [canvas, initialized, activeLineColor, activeLineThickness]);
  
  // Expose canvas operations to parent component
  useEffect(() => {
    if (!onCanvasRef || !canvas) return;
    
    // Simple history for undo/redo
    const history: FabricObject[][] = [];
    let historyIndex = -1;
    let canUndo = false;
    let canRedo = false;
    
    const saveCurrentState = () => {
      const currentState = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
      history.push([...currentState]);
      historyIndex = history.length - 1;
      canUndo = historyIndex > 0;
      canRedo = false;
    };
    
    const undo = () => {
      if (historyIndex > 0) {
        historyIndex--;
        canUndo = historyIndex > 0;
        canRedo = true;
        
        // Restore previous state
        const prevState = history[historyIndex];
        canvas.clear();
        
        // Re-add grid
        createGrid(canvas);
        
        // Add objects from history
        prevState.forEach(obj => canvas.add(obj));
        canvas.renderAll();
      }
    };
    
    const redo = () => {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        canUndo = true;
        canRedo = historyIndex < history.length - 1;
        
        // Restore next state
        const nextState = history[historyIndex];
        canvas.clear();
        
        // Re-add grid
        createGrid(canvas);
        
        // Add objects from history
        nextState.forEach(obj => canvas.add(obj));
        canvas.renderAll();
      }
    };
    
    const clearCanvas = () => {
      const gridObjects = canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
      canvas.clear();
      
      // Re-add grid objects
      gridObjects.forEach(obj => canvas.add(obj));
      canvas.renderAll();
      
      // Save state after clearing
      saveCurrentState();
    };
    
    const saveCanvas = () => {
      if (canvas) {
        const dataURL = canvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 1
        });
        
        // Create download link
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'floor-plan.png';
        link.click();
      }
    };
    
    const operations = {
      canvas,
      canUndo,
      canRedo,
      undo,
      redo,
      clearCanvas,
      saveCanvas,
      saveCurrentState,
      getCanvas: () => canvas
    };
    
    onCanvasRef(operations);
    operationsRef.current = operations;
  }, [canvas, onCanvasRef]);
  
  return (
    <>
      <canvas ref={canvasRef} className="border border-gray-200" />
      
      {canvas && (
        <CanvasEventManager
          canvas={canvas}
          tool={activeTool}
          lineThickness={activeLineThickness}
          lineColor={activeLineColor}
          gridLayerRef={gridLayerRef}
        />
      )}
    </>
  );
};
