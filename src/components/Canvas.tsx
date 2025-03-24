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
  const gridLayerRef = useRef<fabric.Object[]>([]);
  const [tool, setTool] = useState<"draw" | "room" | "straightLine">("draw");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [gia, setGia] = useState(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const historyRef = useRef<{past: fabric.Object[][], future: fabric.Object[][]}>({
    past: [],
    future: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const plans = await loadFloorPlans();
        setFloorPlans(plans);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading floor plans:", error);
        toast.error("Failed to load floor plans");
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    setupCanvas();
    
    const interval = setInterval(async () => {
      try {
        await saveFloorPlans(floorPlans);
        console.log("Floor plans autosaved");
      } catch (error) {
        console.error("Autosave failed:", error);
      }
    }, 10000);
    
    return () => {
      clearInterval(interval);
      fabricCanvasRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (isLoading || floorPlans.length === 0) return;
    
    const saveData = async () => {
      try {
        await saveFloorPlans(floorPlans);
      } catch (error) {
        console.error("Error saving floor plans:", error);
      }
    };
    
    saveData();
  }, [floorPlans, isLoading]);

  useEffect(() => {
    if (!fabricCanvasRef.current || isLoading || floorPlans.length === 0) return;
    
    clearDrawings();
    
    drawFloorPlan();
    
    recalculateGIA();
  }, [currentFloor, floorPlans, isLoading]);

  const createGrid = (canvas: fabric.Canvas) => {
    console.log("Creating grid...");
    
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        canvas.remove(obj);
      });
      gridLayerRef.current = [];
    }
    
    const gridObjects: fabric.Object[] = [];
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    for (let i = 0; i < canvasWidth; i += SMALL_GRID) {
      const smallGridLine = new fabric.Line([i, 0, i, canvasHeight], {
        stroke: "#E6F3F8",
        selectable: false,
        strokeWidth: 0.5,
        evented: false,
      });
      canvas.add(smallGridLine);
      gridObjects.push(smallGridLine);
    }
    
    for (let i = 0; i < canvasHeight; i += SMALL_GRID) {
      const smallGridLine = new fabric.Line([0, i, canvasWidth, i], {
        stroke: "#E6F3F8",
        selectable: false,
        strokeWidth: 0.5,
        evented: false,
      });
      canvas.add(smallGridLine);
      gridObjects.push(smallGridLine);
    }

    for (let i = 0; i < canvasWidth; i += LARGE_GRID) {
      const largeGridLine = new fabric.Line([i, 0, i, canvasHeight], {
        stroke: "#C2E2F3",
        selectable: false,
        strokeWidth: 1,
        evented: false,
      });
      canvas.add(largeGridLine);
      gridObjects.push(largeGridLine);
    }
    
    for (let i = 0; i < canvasHeight; i += LARGE_GRID) {
      const largeGridLine = new fabric.Line([0, i, canvasWidth, i], {
        stroke: "#C2E2F3",
        selectable: false,
        strokeWidth: 1,
        evented: false,
      });
      canvas.add(largeGridLine);
      gridObjects.push(largeGridLine);
    }

    const scaleMarker = new fabric.Group([
      new fabric.Line([canvasWidth - LARGE_GRID - 20, canvasHeight - 20, canvasWidth - 20, canvasHeight - 20], {
        stroke: "#333333",
        strokeWidth: 2,
      }),
      new fabric.Text("1m", {
        left: canvasWidth - LARGE_GRID/2 - 30,
        top: canvasHeight - 35,
        fontSize: 12,
        fill: "#333333",
      })
    ], {
      selectable: false,
      evented: false,
    });
    canvas.add(scaleMarker);
    gridObjects.push(scaleMarker);
    
    gridObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    gridLayerRef.current = gridObjects;
    canvas.renderAll();
    
    console.log(`Grid created with ${gridObjects.length} objects`);
    return gridObjects;
  };

  const setupCanvas = () => {
    if (!canvasRef.current) return;
    
    console.log("Setting up canvas...");

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#FFFFFF",
      isDrawingMode: true,
      selection: false,
    });
    
    fabricCanvasRef.current = fabricCanvas;

    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = "#000000";
    fabricCanvas.freeDrawingBrush.width = 2;

    createGrid(fabricCanvas);
    
    fabricCanvas.on('object:added', () => {
      if (gridLayerRef.current.length === 0) {
        console.log("Grid missing, recreating...");
        createGrid(fabricCanvas);
      } else {
        gridLayerRef.current.forEach(gridObj => {
          fabricCanvas.sendObjectToBack(gridObj);
        });
        fabricCanvas.renderAll();
      }
    });

    fabricCanvas.on('path:created', (e) => {
      const path = e.path as fabric.Path;
      
      if (!path.path) return;
      
      const points = fabricPathToPoints(path.path);
      
      const snappedPoints = snapToGrid(points);

      const finalPoints = tool === 'straightLine' 
        ? straightenStroke(snappedPoints) 
        : snappedPoints;

      try {
        const polyline = new fabric.Polyline(
          finalPoints.map(p => ({ x: p.x * PIXELS_PER_METER, y: p.y * PIXELS_PER_METER })),
          {
            stroke: '#000000',
            strokeWidth: 2,
            fill: tool === 'room' ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
            objectType: tool === 'room' ? 'room' : 'line'
          }
        );

        fabricCanvas.remove(path);
        fabricCanvas.add(polyline);
        
        gridLayerRef.current.forEach(gridObj => {
          fabricCanvas.sendObjectToBack(gridObj);
        });
        
        fabricCanvas.renderAll();
        
        setFloorPlans(prev => {
          const newFloorPlans = [...prev];
          newFloorPlans[currentFloor] = {
            ...newFloorPlans[currentFloor],
            strokes: [...newFloorPlans[currentFloor].strokes, finalPoints]
          };
          
          if (tool === 'room' && finalPoints.length > 2) {
            const area = calculateGIA(finalPoints);
            setGia(prev => prev + area);
            toast.success(`Room added: ${area.toFixed(2)} m²`);
          }
          
          return newFloorPlans;
        });

        const currentState = fabricCanvas.getObjects().filter(obj => 
          obj.type === 'polyline' || obj.type === 'path'
        );
        historyRef.current.past.push([...currentState]);
        historyRef.current.future = [];
      } catch (error) {
        console.error("Error processing drawing:", error);
        toast.error("Failed to process drawing");
      }
    });

    const initialState = fabricCanvas.getObjects().filter(obj => 
      obj.type === 'path' || obj.type === 'polyline'
    );
    historyRef.current.past.push([...initialState]);

    toast.success("Canvas ready for drawing!");
  };

  const drawFloorPlan = () => {
    if (!fabricCanvasRef.current) return;
    
    const currentPlan = floorPlans[currentFloor];
    
    if (gridLayerRef.current.length === 0) {
      createGrid(fabricCanvasRef.current);
    }
    
    gridLayerRef.current.forEach(gridObj => {
      fabricCanvasRef.current!.sendObjectToBack(gridObj);
    });
    
    currentPlan.strokes.forEach(stroke => {
      const polyline = new fabric.Polyline(
        stroke.map(p => ({ x: p.x * PIXELS_PER_METER, y: p.y * PIXELS_PER_METER })),
        {
          stroke: '#000000',
          strokeWidth: 2,
          fill: 'transparent',
          objectType: 'line'
        }
      );
      
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

  const clearDrawings = () => {
    if (!fabricCanvasRef.current) return;
    
    const gridObjects = [...gridLayerRef.current];
    
    const objects = fabricCanvasRef.current.getObjects().filter(obj => 
      !gridLayerRef.current.includes(obj)
    );
    
    objects.forEach((obj) => {
      fabricCanvasRef.current!.remove(obj);
    });
    
    if (gridObjects.length === 0 || !fabricCanvasRef.current.contains(gridObjects[0])) {
      console.log("Recreating grid during clearDrawings...");
      createGrid(fabricCanvasRef.current);
    }
    
    fabricCanvasRef.current.renderAll();
  };

  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    fabricCanvasRef.current.isDrawingMode = true;
    
    if (fabricCanvasRef.current.freeDrawingBrush) {
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
      const currentState = fabricCanvasRef.current.getObjects().filter(obj => 
        obj.type === 'path' || obj.type === 'polyline'
      );
      historyRef.current.future.unshift([...currentState]);
      
      historyRef.current.past.pop();
      
      const previousState = historyRef.current.past[historyRef.current.past.length - 1];
      
      clearDrawings();
      
      previousState.forEach(obj => fabricCanvasRef.current!.add(obj));
      
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
      const nextState = historyRef.current.future[0];
      
      historyRef.current.future.shift();
      historyRef.current.past.push([...nextState]);
      
      clearDrawings();
      
      nextState.forEach(obj => fabricCanvasRef.current!.add(obj));
      
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
    
    clearDrawings();
    
    historyRef.current.past = [[]];
    historyRef.current.future = [];
    
    setFloorPlans(prev => {
      const newFloorPlans = [...prev];
      if (newFloorPlans[currentFloor]) {
        newFloorPlans[currentFloor] = {
          ...newFloorPlans[currentFloor],
          strokes: []
        };
      }
      return newFloorPlans;
    });
    setGia(0);
    
    toast.success("Canvas cleared");
  };

  const saveCanvas = () => {
    if (!fabricCanvasRef.current) return;
    
    try {
      saveFloorPlans(floorPlans)
        .then(() => {
          toast.success("Floor plans saved to offline storage");
          
          const dataUrl = fabricCanvasRef.current!.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 1
          });
          const link = document.createElement("a");
          link.download = `floorplan-${floorPlans[currentFloor]?.label || 'untitled'}.png`;
          link.href = dataUrl;
          link.click();
          
          toast.success("Floorplan image exported");
        })
        .catch(error => {
          console.error("Save failed:", error);
          toast.error("Failed to save floor plans");
        });
    } catch (e) {
      console.error('Save failed:', e);
      toast.error("Failed to save floorplan");
    }
  };

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
      toast.info(`Switched to ${floorPlans[index]?.label || 'Unknown floor'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Loading your floor plans...</p>
        </div>
      </div>
    );
  }

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
