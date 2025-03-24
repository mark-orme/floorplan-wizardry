
import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ZoomIn,
  ZoomOut,
  Pencil,
  Square,
  Undo,
  Redo,
  Save,
  Trash,
} from "lucide-react";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [tool, setTool] = useState<"draw" | "room">("draw");
  const [zoomLevel, setZoomLevel] = useState(1);
  const historyRef = useRef<{past: fabric.Object[][], future: fabric.Object[][]}>({
    past: [],
    future: []
  });

  // Scale factors: 1 meter = 100 pixels
  const PIXELS_PER_METER = 100;
  const SMALL_GRID = 0.1 * PIXELS_PER_METER; // 0.1m grid = 10px
  const LARGE_GRID = 1.0 * PIXELS_PER_METER; // 1.0m grid = 100px

  // Setup canvas and initialize drawing
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create fabric canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#FFFFFF", // Pure white background
      isDrawingMode: true, // Start in drawing mode
    });
    
    fabricCanvasRef.current = fabricCanvas;

    // Configure drawing brush
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = "#000000";
    fabricCanvas.freeDrawingBrush.width = 2;

    // Add small grid (0.1m)
    for (let i = 0; i < fabricCanvas.width!; i += SMALL_GRID) {
      fabricCanvas.add(
        new fabric.Line([i, 0, i, fabricCanvas.height!], {
          stroke: "#E6F3F8", // Very light blue for fine grid
          selectable: false,
          strokeWidth: 0.5,
          evented: false,
        })
      );
    }
    for (let i = 0; i < fabricCanvas.height!; i += SMALL_GRID) {
      fabricCanvas.add(
        new fabric.Line([0, i, fabricCanvas.width!, i], {
          stroke: "#E6F3F8", // Very light blue for fine grid
          selectable: false,
          strokeWidth: 0.5,
          evented: false,
        })
      );
    }

    // Add large grid (1.0m)
    for (let i = 0; i < fabricCanvas.width!; i += LARGE_GRID) {
      fabricCanvas.add(
        new fabric.Line([i, 0, i, fabricCanvas.height!], {
          stroke: "#C2E2F3", // Light blue for major grid
          selectable: false,
          strokeWidth: 1,
          evented: false,
        })
      );
    }
    for (let i = 0; i < fabricCanvas.height!; i += LARGE_GRID) {
      fabricCanvas.add(
        new fabric.Line([0, i, fabricCanvas.width!, i], {
          stroke: "#C2E2F3", // Light blue for major grid
          selectable: false,
          strokeWidth: 1,
          evented: false,
        })
      );
    }

    // Add 1m scale marker at bottom right
    const scaleMarker = new fabric.Group([
      new fabric.Line([fabricCanvas.width! - LARGE_GRID - 20, fabricCanvas.height! - 20, fabricCanvas.width! - 20, fabricCanvas.height! - 20], {
        stroke: "#C2E2F3",
        strokeWidth: 2,
      }),
      new fabric.Text("1m", {
        left: fabricCanvas.width! - LARGE_GRID/2 - 30,
        top: fabricCanvas.height! - 35,
        fontSize: 12,
        fill: "#88B7D3",
      })
    ], {
      selectable: false,
      evented: false,
    });
    fabricCanvas.add(scaleMarker);

    // Save initial state for history
    const initialState = fabricCanvas.getObjects().filter(obj => 
      obj.type === 'path'
    );
    historyRef.current.past.push([...initialState]);

    // Track object additions for undo/redo
    fabricCanvas.on('object:added', () => {
      if (fabricCanvas.isDrawingMode) {
        const currentState = fabricCanvas.getObjects().filter(obj => 
          obj.type === 'path'
        );
        historyRef.current.past.push([...currentState]);
        historyRef.current.future = [];
      }
    });

    toast.success("Canvas ready for drawing!");

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Update drawing mode when tool changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.isDrawingMode = tool === "draw";
    fabricCanvasRef.current.renderAll();
  }, [tool]);

  const handleToolChange = (newTool: "draw" | "room") => {
    setTool(newTool);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.isDrawingMode = newTool === "draw";
      // If switching to draw mode, ensure the brush is properly configured
      if (newTool === "draw") {
        fabricCanvasRef.current.freeDrawingBrush = new fabric.PencilBrush(fabricCanvasRef.current);
        fabricCanvasRef.current.freeDrawingBrush.color = "#000000";
        fabricCanvasRef.current.freeDrawingBrush.width = 2;
      }
      fabricCanvasRef.current.renderAll();
      toast.success(`${newTool === "draw" ? "Drawing" : "Room"} tool selected`);
    }
  };

  const handleUndo = () => {
    if (!fabricCanvasRef.current) return;
    
    if (historyRef.current.past.length > 1) {
      // Move current state to future
      const currentState = fabricCanvasRef.current.getObjects().filter(obj => 
        obj.type === 'path'
      );
      historyRef.current.future.unshift([...currentState]);
      
      // Remove current state from past
      historyRef.current.past.pop();
      
      // Get previous state
      const previousState = historyRef.current.past[historyRef.current.past.length - 1];
      
      // Clear canvas of paths
      const pathObjects = fabricCanvasRef.current.getObjects().filter(obj => 
        obj.type === 'path'
      );
      pathObjects.forEach(obj => fabricCanvasRef.current!.remove(obj));
      
      // Restore previous state
      previousState.forEach(obj => fabricCanvasRef.current!.add(obj));
      
      fabricCanvasRef.current.renderAll();
      toast("Undo successful");
    } else {
      toast("Nothing to undo");
    }
  };

  const handleRedo = () => {
    if (!fabricCanvasRef.current) return;
    
    if (historyRef.current.future.length > 0) {
      // Get next state
      const nextState = historyRef.current.future[0];
      
      // Move next state from future to past
      historyRef.current.future.shift();
      historyRef.current.past.push([...nextState]);
      
      // Clear canvas of paths
      const pathObjects = fabricCanvasRef.current.getObjects().filter(obj => 
        obj.type === 'path'
      );
      pathObjects.forEach(obj => fabricCanvasRef.current!.remove(obj));
      
      // Restore next state
      nextState.forEach(obj => fabricCanvasRef.current!.add(obj));
      
      fabricCanvasRef.current.renderAll();
      toast("Redo successful");
    } else {
      toast("Nothing to redo");
    }
  };

  const handleZoom = (direction: "in" | "out") => {
    if (!fabricCanvasRef.current) return;
    const factor = direction === "in" ? 1.1 : 0.9;
    const newZoom = zoomLevel * factor;
    if (newZoom >= 0.5 && newZoom <= 3) {
      fabricCanvasRef.current.setZoom(newZoom);
      setZoomLevel(newZoom);
      toast(`Zoom: ${Math.round(newZoom * 100)}%`);
    }
  };

  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return;
    // Clear only the drawings, not the grid
    const objects = fabricCanvasRef.current.getObjects('path');
    objects.forEach((obj) => fabricCanvasRef.current!.remove(obj));
    
    // Update history
    historyRef.current.past = [[]];
    historyRef.current.future = [];
    
    fabricCanvasRef.current.renderAll();
    toast.success("Canvas cleared");
  };

  const saveCanvas = () => {
    if (!fabricCanvasRef.current) return;
    const dataUrl = fabricCanvasRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "floorplan.png";
    link.href = dataUrl;
    link.click();
    toast.success("Floorplan saved");
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1200px] mx-auto">
      <Card className="p-6 backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-800">
        <div className="flex gap-4 mb-4">
          {/* Tool Selection */}
          <div className="flex gap-2">
            <Button
              variant={tool === "draw" ? "default" : "outline"}
              onClick={() => handleToolChange("draw")}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform"
              title="Draw Tool"
            >
              <Pencil className="w-4 h-4 transition-colors" />
            </Button>
            <Button
              variant={tool === "room" ? "default" : "outline"}
              onClick={() => handleToolChange("room")}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform"
              title="Room Tool"
            >
              <Square className="w-4 h-4 transition-colors" />
            </Button>
          </div>
          
          {/* History Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleUndo}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Undo"
            >
              <Undo className="w-4 h-4 transition-colors" />
            </Button>
            <Button
              variant="outline"
              onClick={handleRedo}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Redo"
            >
              <Redo className="w-4 h-4 transition-colors" />
            </Button>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleZoom("in")}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 transition-colors" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleZoom("out")}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 transition-colors" />
            </Button>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              onClick={clearCanvas}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-red-50 dark:hover:bg-red-950"
              title="Clear Canvas"
            >
              <Trash className="w-4 h-4 text-red-500 transition-colors" />
            </Button>
            <Button
              variant="default"
              onClick={saveCanvas}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform"
              title="Save as PNG"
            >
              <Save className="w-4 h-4 transition-colors" />
            </Button>
          </div>
        </div>

        <canvas ref={canvasRef} />
      </Card>
    </div>
  );
};
