import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { DrawingToolbar } from "./DrawingToolbar";
import { FloorPlanList } from "./FloorPlanList";
import {
  GRID_SIZE,
  PIXELS_PER_METER,
  SMALL_GRID,
  LARGE_GRID,
  snapToGrid,
  straightenStroke,
  calculateGIA,
  fabricPathToPoints,
  loadFloorPlans,
  saveFloorPlans,
  type Stroke,
  type FloorPlan
} from "@/utils/drawing";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [tool, setTool] = useState<"draw" | "room" | "straightLine">("draw");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [gia, setGia] = useState(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(loadFloorPlans());
  const [currentFloor, setCurrentFloor] = useState(0);
  const historyRef = useRef<{past: fabric.Object[][], future: fabric.Object[][]}>({
    past: [],
    future: []
  });

  // Initialize canvas when component mounts
  useEffect(() => {
    setupCanvas();
    
    // Setup autosave
    const interval = setInterval(() => {
      saveFloorPlans(floorPlans);
    }, 10000); // Autosave every 10 seconds
    
    return () => {
      clearInterval(interval);
      fabricCanvasRef.current?.dispose();
    };
  }, []);

  // When floor plan changes, update the canvas
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    // Clear existing drawings but not grid
    clearDrawings();
    
    // Add strokes from current floor plan
    drawFloorPlan();
    
    // Recalculate GIA
    recalculateGIA();
    
  }, [currentFloor, floorPlans]);

  // Setup canvas and initialize drawing
  const setupCanvas = () => {
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

      // Only remove the original path AFTER successfully creating the polyline
      try {
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
        fabricCanvas.renderAll(); // Force a re-render

        // Update floor plan data and calculate GIA
        setFloorPlans(prev => {
          const newFloorPlans = [...prev];
          newFloorPlans[currentFloor] = {
            ...newFloorPlans[currentFloor],
            strokes: [...newFloorPlans[currentFloor].strokes, finalPoints]
          };
          
          // Calculate GIA from closed shapes (rooms)
          if (tool === 'room' && finalPoints.length > 2) {
            const area = calculateGIA(finalPoints);
            setGia(prev => prev + area);
            toast.success(`Room added: ${area.toFixed(2)} m²`);
          }
          
          return newFloorPlans;
        });

        // Save state for undo/redo
        const currentState = fabricCanvas.getObjects().filter(obj => 
          obj.type === 'polyline' || obj.type === 'path'
        );
        historyRef.current.past.push([...currentState]);
        historyRef.current.future = [];
      } catch (error) {
        console.error("Error processing drawing:", error);
        toast.error("Failed to process drawing");
        // If there was an error, don't remove the original path
      }
    });

    // Save initial state for history
    const initialState = fabricCanvas.getObjects().filter(obj => 
      obj.type === 'path' || obj.type === 'polyline'
    );
    historyRef.current.past.push([...initialState]);

    toast.success("Canvas ready for drawing!");
  };

  // Draw the current floor plan
  const drawFloorPlan = () => {
    if (!fabricCanvasRef.current) return;
    
    const currentPlan = floorPlans[currentFloor];
    currentPlan.strokes.forEach(stroke => {
      const polyline = new fabric.Polyline(
        stroke.map(p => ({ x: p.x * PIXELS_PER_METER, y: p.y * PIXELS_PER_METER })),
        {
          stroke: '#000000',
          strokeWidth: 2,
          fill: 'transparent', // We'll determine which are rooms by closed shape later
          objectType: 'line'
        }
      );
      
      // For closed shapes with 3+ points, treat as rooms
      if (stroke.length > 2 && 
          Math.abs(stroke[0].x - stroke[stroke.length-1].x) < 0.01 && 
          Math.abs(stroke[0].y - stroke[stroke.length-1].y) < 0.01) {
        polyline.set({
          fill: 'rgba(0, 0, 255, 0.1)',
          objectType: 'room'
        });
      }
      
      fabricCanvasRef.current!.add(polyline);
    });
    
    fabricCanvasRef.current.renderAll();
  };

  // Clear only the drawings, not the grid
  const clearDrawings = () => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects().filter(obj => 
      obj.type === 'path' || obj.type === 'polyline'
    );
    objects.forEach((obj) => fabricCanvasRef.current!.remove(obj));
    
    fabricCanvasRef.current.renderAll();
  };

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
      clearDrawings();
      
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
      clearDrawings();
      
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
    clearDrawings();
    
    // Update history
    historyRef.current.past = [[]];
    historyRef.current.future = [];
    
    // Reset floor plan and GIA
    setFloorPlans(prev => {
      const newFloorPlans = [...prev];
      newFloorPlans[currentFloor] = {
        ...newFloorPlans[currentFloor],
        strokes: []
      };
      return newFloorPlans;
    });
    setGia(0);
    
    toast.success("Canvas cleared");
  };

  const saveCanvas = () => {
    if (!fabricCanvasRef.current) return;
    
    try {
      // Save floorplan data
      saveFloorPlans(floorPlans);
      
      // Save canvas as image with corrected options including multiplier
      const dataUrl = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1 // Required multiplier property
      });
      const link = document.createElement("a");
      link.download = `floorplan-${floorPlans[currentFloor].label}.png`;
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

  const handleAddFloor = () => {
    setFloorPlans(prev => [
      ...prev, 
      { 
        strokes: [], 
        label: `Floor ${prev.length + 1}`,
        paperSize: 'infinite'
      }
    ]);
    setCurrentFloor(floorPlans.length);
    toast.success(`New floor plan added: Floor ${floorPlans.length + 1}`);
  };

  const handleSelectFloor = (index: number) => {
    if (index !== currentFloor) {
      setCurrentFloor(index);
      toast.info(`Switched to ${floorPlans[index].label}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-[1200px] mx-auto">
      <div className="md:w-64">
        <FloorPlanList 
          floorPlans={floorPlans}
          currentFloor={currentFloor}
          onSelect={handleSelectFloor}
          onAdd={handleAddFloor}
        />
      </div>
      
      <Card className="flex-1 p-6 backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-800">
        <DrawingToolbar 
          tool={tool}
          onToolChange={handleToolChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onZoom={handleZoom}
          onClear={clearCanvas}
          onSave={saveCanvas}
          gia={gia}
        />

        <canvas ref={canvasRef} />
      </Card>
    </div>
  );
};
