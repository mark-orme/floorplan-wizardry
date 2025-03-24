
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
  Ruler,
} from "lucide-react";
import {
  GRID_SIZE,
  PIXELS_PER_METER,
  SMALL_GRID,
  LARGE_GRID,
  snapToGrid,
  straightenStroke,
  calculateGIA,
  fabricPathToPoints,
  type Stroke,
  type FloorPlan
} from "@/utils/drawing";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [tool, setTool] = useState<"draw" | "room" | "straightLine">("draw");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [gia, setGia] = useState(0);
  const [floorPlan, setFloorPlan] = useState<FloorPlan>({
    strokes: [],
    label: 'Ground Floor',
    paperSize: 'infinite'
  });
  const historyRef = useRef<{past: fabric.Object[][], future: fabric.Object[][]}>({
    past: [],
    future: []
  });

  // Setup canvas and initialize drawing
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create fabric canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#FFFFFF", // Pure white background
      isDrawingMode: true, // Start in drawing mode
      selection: false, // Disable selection by default for drawing
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
        stroke: "#333333",
        strokeWidth: 2,
      }),
      new fabric.Text("1m", {
        left: fabricCanvas.width! - LARGE_GRID/2 - 30,
        top: fabricCanvas.height! - 35,
        fontSize: 12,
        fill: "#333333",
      })
    ], {
      selectable: false,
      evented: false,
    });
    fabricCanvas.add(scaleMarker);

    // Process drawn paths
    fabricCanvas.on('path:created', (e) => {
      const path = e.path as fabric.Path;
      
      if (!path.path) return;
      
      // Convert the fabric path to our point format
      const points = fabricPathToPoints(path.path);
      
      // Apply grid snapping
      const snappedPoints = snapToGrid(points);

      // Apply auto-straighten if in straightLine mode
      const finalPoints = tool === 'straightLine' 
        ? straightenStroke(snappedPoints) 
        : snappedPoints;

      // Create a polyline from the processed points
      const polyline = new fabric.Polyline(
        finalPoints.map(p => ({ x: p.x * PIXELS_PER_METER, y: p.y * PIXELS_PER_METER })),
        {
          stroke: '#000000',
          strokeWidth: 2,
          fill: tool === 'room' ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
          objectType: tool === 'room' ? 'room' : 'line'
        }
      );

      // Remove the original path and add our processed polyline
      fabricCanvas.remove(path);
      fabricCanvas.add(polyline);

      // Update floor plan data and calculate GIA
      setFloorPlan(prev => {
        const newFloorPlan = {...prev};
        newFloorPlan.strokes = [...prev.strokes, finalPoints];
        
        // Calculate GIA from closed shapes (rooms)
        if (tool === 'room' && finalPoints.length > 2) {
          const area = calculateGIA(finalPoints);
          setGia(prev => prev + area);
          toast.success(`Room added: ${area.toFixed(2)} m²`);
        }
        
        return newFloorPlan;
      });

      // Save state for undo/redo
      const currentState = fabricCanvas.getObjects().filter(obj => 
        obj.type === 'polyline' || obj.type === 'path'
      );
      historyRef.current.past.push([...currentState]);
      historyRef.current.future = [];
    });

    // Save initial state for history
    const initialState = fabricCanvas.getObjects().filter(obj => 
      obj.type === 'path' || obj.type === 'polyline'
    );
    historyRef.current.past.push([...initialState]);

    // Setup autosave
    const interval = setInterval(() => {
      try {
        localStorage.setItem('floorplan', JSON.stringify(floorPlan));
      } catch (e) {
        console.error('Autosave failed:', e);
      }
    }, 10000); // Autosave every 10 seconds

    toast.success("Canvas ready for drawing!");

    return () => {
      clearInterval(interval);
      fabricCanvas.dispose();
    };
  }, []);

  // Update drawing mode when tool changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    fabricCanvasRef.current.isDrawingMode = true; // Always in drawing mode for consistency
    
    if (fabricCanvasRef.current.freeDrawingBrush) {
      // Configure brush based on tool
      if (tool === 'straightLine') {
        toast.info("Straight line tool: Strokes will be auto-straightened");
      } else if (tool === 'room') {
        toast.info("Room tool: Draw closed shapes to calculate area");
      }
    }
    
    fabricCanvasRef.current.renderAll();
  }, [tool]);

  const handleToolChange = (newTool: "draw" | "room" | "straightLine") => {
    setTool(newTool);
    if (fabricCanvasRef.current) {
      // Configure brush based on the selected tool
      fabricCanvasRef.current.freeDrawingBrush = new fabric.PencilBrush(fabricCanvasRef.current);
      fabricCanvasRef.current.freeDrawingBrush.color = "#000000";
      fabricCanvasRef.current.freeDrawingBrush.width = 2;
      
      fabricCanvasRef.current.renderAll();
      toast.success(`${newTool === "draw" ? "Drawing" : newTool === "room" ? "Room" : "Straight Line"} tool selected`);
    }
  };

  const handleUndo = () => {
    if (!fabricCanvasRef.current) return;
    
    if (historyRef.current.past.length > 1) {
      // Move current state to future
      const currentState = fabricCanvasRef.current.getObjects().filter(obj => 
        obj.type === 'path' || obj.type === 'polyline'
      );
      historyRef.current.future.unshift([...currentState]);
      
      // Remove current state from past
      historyRef.current.past.pop();
      
      // Get previous state
      const previousState = historyRef.current.past[historyRef.current.past.length - 1];
      
      // Clear canvas of paths and polylines
      const objectsToRemove = fabricCanvasRef.current.getObjects().filter(obj => 
        obj.type === 'path' || obj.type === 'polyline'
      );
      objectsToRemove.forEach(obj => fabricCanvasRef.current!.remove(obj));
      
      // Restore previous state
      previousState.forEach(obj => fabricCanvasRef.current!.add(obj));
      
      // Recalculate GIA
      recalculateGIA();
      
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
      
      // Clear canvas of paths and polylines
      const objectsToRemove = fabricCanvasRef.current.getObjects().filter(obj => 
        obj.type === 'path' || obj.type === 'polyline'
      );
      objectsToRemove.forEach(obj => fabricCanvasRef.current!.remove(obj));
      
      // Restore next state
      nextState.forEach(obj => fabricCanvasRef.current!.add(obj));
      
      // Recalculate GIA
      recalculateGIA();
      
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
    const objects = fabricCanvasRef.current.getObjects().filter(obj => 
      obj.type === 'path' || obj.type === 'polyline'
    );
    objects.forEach((obj) => fabricCanvasRef.current!.remove(obj));
    
    // Update history
    historyRef.current.past = [[]];
    historyRef.current.future = [];
    
    // Reset floor plan and GIA
    setFloorPlan({
      strokes: [],
      label: 'Ground Floor',
      paperSize: 'infinite'
    });
    setGia(0);
    
    fabricCanvasRef.current.renderAll();
    toast.success("Canvas cleared");
  };

  const saveCanvas = () => {
    if (!fabricCanvasRef.current) return;
    
    try {
      // Save floorplan data
      localStorage.setItem('floorplan', JSON.stringify(floorPlan));
      
      // Save canvas as image
      const dataUrl = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1
      });
      const link = document.createElement("a");
      link.download = "floorplan.png";
      link.href = dataUrl;
      link.click();
      
      toast.success("Floorplan saved");
    } catch (e) {
      console.error('Save failed:', e);
      toast.error("Failed to save floorplan");
    }
  };

  // Recalculate GIA based on current objects
  const recalculateGIA = () => {
    if (!fabricCanvasRef.current) return;
    
    let totalGIA = 0;
    const rooms = fabricCanvasRef.current.getObjects().filter(
      obj => obj.type === 'polyline' && (obj as any).objectType === 'room'
    );
    
    rooms.forEach(room => {
      const coords = (room as fabric.Polyline).points || [];
      if (coords.length > 2) {
        const points: Stroke = coords.map(p => ({ 
          x: p.x / PIXELS_PER_METER, 
          y: p.y / PIXELS_PER_METER 
        }));
        totalGIA += calculateGIA(points);
      }
    });
    
    setGia(totalGIA);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1200px] mx-auto">
      <Card className="p-6 backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-800">
        <div className="flex gap-4 mb-4 flex-wrap">
          {/* Tool Selection */}
          <div className="flex gap-2">
            <Button
              variant={tool === "draw" ? "default" : "outline"}
              onClick={() => handleToolChange("draw")}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform"
              title="Freehand Tool"
            >
              <Pencil className="w-4 h-4 transition-colors" />
            </Button>
            <Button
              variant={tool === "straightLine" ? "default" : "outline"}
              onClick={() => handleToolChange("straightLine")}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform"
              title="Straight Line Tool"
            >
              <Ruler className="w-4 h-4 transition-colors" />
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
          
          {/* GIA Display */}
          <div className="flex items-center ml-auto mr-4 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
            <span className="text-sm font-medium">GIA: {gia.toFixed(2)} m²</span>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
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
