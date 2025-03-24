import { useEffect, useRef, useState, useCallback } from "react";
import { 
  Canvas as FabricCanvas, 
  PencilBrush, 
  Circle, 
  Line, 
  Path, 
  Polyline, 
  Group, 
  Text, 
  Object as FabricObject 
} from "fabric";
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
import {
  initializeDrawingBrush,
  setCanvasDimensions,
  disposeCanvas,
  clearCanvasObjects
} from "@/utils/fabricHelpers";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
  const resizeTimeoutRef = useRef<number | null>(null);
  
  const [tool, setTool] = useState<"draw" | "room" | "straightLine">("draw");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [gia, setGia] = useState(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const historyRef = useRef<{past: FabricObject[][], future: FabricObject[][]}>({
    past: [],
    future: []
  });
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });
  const canvasInitializedRef = useRef(false);

  const [debugInfo, setDebugInfo] = useState<{
    canvasInitialized: boolean,
    gridCreated: boolean,
    dimensionsSet: boolean,
    brushInitialized: boolean
  }>({
    canvasInitialized: false,
    gridCreated: false,
    dimensionsSet: false,
    brushInitialized: false
  });

  const loadData = useCallback(async () => {
    try {
      console.log("Loading floor plans...");
      setIsLoading(true);
      const plans = await loadFloorPlans();
      setFloorPlans(plans);
      setIsLoading(false);
      console.log("Floor plans loaded:", plans);
    } catch (error) {
      console.error("Error loading floor plans:", error);
      toast.error("Failed to load floor plans");
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadData();
  }, [loadData]);

  const createGrid = useCallback((canvas: FabricCanvas) => {
    console.log("Creating grid...");
    
    try {
      if (gridLayerRef.current.length > 0) {
        gridLayerRef.current.forEach(obj => {
          canvas.remove(obj);
        });
        gridLayerRef.current = [];
      }
      
      const gridObjects: FabricObject[] = [];
      const canvasWidth = canvas.getWidth() || canvasDimensions.width;
      const canvasHeight = canvas.getHeight() || canvasDimensions.height;
      
      console.log(`Canvas dimensions for grid: ${canvasWidth}x${canvasHeight}`);
      
      if (canvasWidth <= 0 || canvasHeight <= 0) {
        console.error("Invalid canvas dimensions for grid creation");
        return [];
      }
      
      const smallGridStep = SMALL_GRID;
      for (let i = 0; i < canvasWidth; i += smallGridStep) {
        const smallGridLine = new Line([i, 0, i, canvasHeight], {
          stroke: "#E6F3F8",
          selectable: false,
          strokeWidth: 0.5,
          evented: false,
        });
        canvas.add(smallGridLine);
        gridObjects.push(smallGridLine);
      }
      
      for (let i = 0; i < canvasHeight; i += smallGridStep) {
        const smallGridLine = new Line([0, i, canvasWidth, i], {
          stroke: "#E6F3F8",
          selectable: false,
          strokeWidth: 0.5,
          evented: false,
        });
        canvas.add(smallGridLine);
        gridObjects.push(smallGridLine);
      }

      const largeGridStep = LARGE_GRID;
      for (let i = 0; i < canvasWidth; i += largeGridStep) {
        const largeGridLine = new Line([i, 0, i, canvasHeight], {
          stroke: "#C2E2F3",
          selectable: false,
          strokeWidth: 1,
          evented: false,
        });
        canvas.add(largeGridLine);
        gridObjects.push(largeGridLine);
      }
      
      for (let i = 0; i < canvasHeight; i += largeGridStep) {
        const largeGridLine = new Line([0, i, canvasWidth, i], {
          stroke: "#C2E2F3",
          selectable: false,
          strokeWidth: 1,
          evented: false,
        });
        canvas.add(largeGridLine);
        gridObjects.push(largeGridLine);
      }

      const scaleMarker = new Group([
        new Line([canvasWidth - largeGridStep - 20, canvasHeight - 20, canvasWidth - 20, canvasHeight - 20], {
          stroke: "#333333",
          strokeWidth: 2,
        }),
        new Text("1m", {
          left: canvasWidth - largeGridStep/2 - 30,
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
      
      setDebugInfo(prev => ({...prev, gridCreated: true}));
      
      console.log(`Grid created with ${gridObjects.length} objects`);
      return gridObjects;
    } catch (err) {
      console.error("Error creating grid:", err);
      return [];
    }
  }, [canvasDimensions]);

  useEffect(() => {
    if (!canvasRef.current) {
      console.log("Canvas ref is null, will retry later");
      return;
    }
    
    if (canvasInitializedRef.current) {
      console.log("Canvas already initialized, skipping");
      return;
    }
    
    console.log("Initializing canvas with dimensions:", canvasDimensions);
    
    try {
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        backgroundColor: "#FFFFFF",
        isDrawingMode: true,
        selection: false,
        width: canvasDimensions.width,
        height: canvasDimensions.height,
        renderOnAddRemove: false
      });
      
      console.log("FabricCanvas instance created");
      fabricCanvasRef.current = fabricCanvas;
      canvasInitializedRef.current = true;
      
      const pencilBrush = new PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush = pencilBrush;
      fabricCanvas.freeDrawingBrush.color = "#000000";
      fabricCanvas.freeDrawingBrush.width = 2;
      
      setDebugInfo(prev => ({
        ...prev, 
        canvasInitialized: true,
        brushInitialized: true
      }));
      
      createGrid(fabricCanvas);
      
      const handleObjectAdded = () => {
        console.log("Object added to canvas");
        if (gridLayerRef.current.length === 0) {
          createGrid(fabricCanvas);
        } else {
          gridLayerRef.current.forEach(gridObj => {
            fabricCanvas.sendObjectToBack(gridObj);
          });
          fabricCanvas.renderAll();
        }
      };
      
      fabricCanvas.on('object:added', handleObjectAdded);

      const handlePathCreated = (e: { path: Path }) => {
        console.log("Path created event triggered");
        const path = e.path;
        
        if (!path.path) {
          console.error("Invalid path object:", path);
          return;
        }
        
        try {
          const points = fabricPathToPoints(path.path);
          console.log("Points extracted from path:", points.length);
          
          if (points.length < 2) {
            console.error("Not enough points to create a path");
            return;
          }
          
          const snappedPoints = snapToGrid(points);
          console.log("Points snapped to grid");

          const finalPoints = tool === 'straightLine' 
            ? straightenStroke(snappedPoints) 
            : snappedPoints;
          console.log("Final points processed for tool:", tool);

          const polyline = new Polyline(
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
            if (newFloorPlans[currentFloor]) {
              newFloorPlans[currentFloor] = {
                ...newFloorPlans[currentFloor],
                strokes: [...newFloorPlans[currentFloor].strokes, finalPoints]
              };
              
              if (tool === 'room' && finalPoints.length > 2) {
                const area = calculateGIA(finalPoints);
                setGia(prev => prev + area);
                toast.success(`Room added: ${area.toFixed(2)} m²`);
              }
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
      };
      
      fabricCanvas.on('path:created', handlePathCreated);

      const initialState = fabricCanvas.getObjects().filter(obj => 
        obj.type === 'path' || obj.type === 'polyline'
      );
      historyRef.current.past.push([...initialState]);
      
      toast.success("Canvas ready for drawing!");
      
      return () => {
        if (fabricCanvas) {
          fabricCanvas.off('object:added', handleObjectAdded);
          fabricCanvas.off('path:created', handlePathCreated);
          disposeCanvas(fabricCanvas);
          fabricCanvasRef.current = null;
          canvasInitializedRef.current = false;
          gridLayerRef.current = [];
        }
      };
    } catch (err) {
      console.error("Error initializing canvas:", err);
      toast.error("Failed to initialize canvas");
    }
  }, [canvasDimensions, tool, currentFloor, createGrid]);

  useEffect(() => {
    console.log("Setting up resize handler");
    
    const updateCanvasDimensions = () => {
      if (!canvasRef.current) return;
      
      const container = document.querySelector('.canvas-container');
      console.log("Container found:", !!container);
      if (!container) return;
      
      const { width, height } = container.getBoundingClientRect();
      console.log("Container dimensions:", width, height);
      
      if (width <= 0 || height <= 0) return;
      
      const newWidth = Math.max(width - 20, 600);
      const newHeight = Math.max(height - 20, 400);
      
      setCanvasDimensions({ width: newWidth, height: newHeight });
      setDebugInfo(prev => ({...prev, dimensionsSet: true}));
      
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.renderOnAddRemove = false;
        fabricCanvasRef.current.setDimensions({ width: newWidth, height: newHeight });
        createGrid(fabricCanvasRef.current);
        fabricCanvasRef.current.renderOnAddRemove = true;
        fabricCanvasRef.current.renderAll();
      } else {
        console.log("Fabric canvas ref not available for dimension update");
      }
    };

    const debouncedResizeHandler = () => {
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = window.setTimeout(() => {
        updateCanvasDimensions();
        resizeTimeoutRef.current = null;
      }, 250);
    };

    window.addEventListener('resize', debouncedResizeHandler);
    
    updateCanvasDimensions();
    
    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [createGrid]);

  const saveTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (isLoading || floorPlans.length === 0) return;
    
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        await saveFloorPlans(floorPlans);
        saveTimeoutRef.current = null;
      } catch (error) {
        console.error("Error saving floor plans:", error);
      }
    }, 1000);
    
    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [floorPlans, isLoading]);

  useEffect(() => {
    if (!fabricCanvasRef.current || isLoading || floorPlans.length === 0) return;
    
    console.log("Floor changed, updating canvas");
    clearDrawings();
    drawFloorPlan();
    recalculateGIA();
  }, [currentFloor, floorPlans, isLoading]);

  const drawFloorPlan = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const currentPlan = floorPlans[currentFloor];
    if (!currentPlan) return;
    
    if (gridLayerRef.current.length === 0) {
      createGrid(fabricCanvasRef.current);
    }
    
    fabricCanvasRef.current.renderOnAddRemove = false;
    
    gridLayerRef.current.forEach(gridObj => {
      fabricCanvasRef.current!.sendObjectToBack(gridObj);
    });
    
    currentPlan.strokes.forEach(stroke => {
      const polyline = new Polyline(
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
    
    fabricCanvasRef.current.renderOnAddRemove = true;
    fabricCanvasRef.current.renderAll();
  }, [floorPlans, currentFloor, createGrid]);

  const clearDrawings = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const gridObjects = [...gridLayerRef.current];
    
    clearCanvasObjects(fabricCanvasRef.current, gridObjects);
    
    if (gridObjects.length === 0 || !fabricCanvasRef.current.contains(gridObjects[0])) {
      console.log("Recreating grid during clearDrawings...");
      createGrid(fabricCanvasRef.current);
    }
    
    fabricCanvasRef.current.renderAll();
  }, [createGrid]);

  useEffect(() => {
    if (!fabricCanvasRef.current) {
      console.error("Fabric canvas ref not available when tool changed");
      return;
    }
    
    console.log("Tool changed to:", tool);
    fabricCanvasRef.current.isDrawingMode = true;
    
    if (fabricCanvasRef.current.freeDrawingBrush) {
      console.log("Drawing brush exists, configuring for tool:", tool);
      if (tool === 'straightLine') {
        toast.info("Straight line tool: Strokes will be auto-straightened");
      } else if (tool === 'room') {
        toast.info("Room tool: Draw closed shapes to calculate area");
      }
    } else {
      console.error("Drawing brush not initialized when tool changed");
      
      try {
        const pencilBrush = new PencilBrush(fabricCanvasRef.current);
        fabricCanvasRef.current.freeDrawingBrush = pencilBrush;
        fabricCanvasRef.current.freeDrawingBrush.color = "#000000";
        fabricCanvasRef.current.freeDrawingBrush.width = 2;
        console.log("Drawing brush reinitialized");
      } catch (brushErr) {
        console.error("Error reinitializing brush:", brushErr);
      }
    }
    
    fabricCanvasRef.current.renderAll();
  }, [tool]);

  const handleToolChange = useCallback((newTool: "draw" | "room" | "straightLine") => {
    setTool(newTool);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.freeDrawingBrush = new PencilBrush(fabricCanvasRef.current);
      fabricCanvasRef.current.freeDrawingBrush.color = "#000000";
      fabricCanvasRef.current.freeDrawingBrush.width = 2;
      
      fabricCanvasRef.current.renderAll();
      toast.success(`${newTool === "draw" ? "Drawing" : newTool === "room" ? "Room" : "Straight Line"} tool selected`);
    }
  }, []);

  const handleUndo = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    if (historyRef.current.past.length > 1) {
      fabricCanvasRef.current.renderOnAddRemove = false;
      
      const currentState = fabricCanvasRef.current.getObjects().filter(obj => 
        obj.type === 'path' || obj.type === 'polyline'
      );
      historyRef.current.future.unshift([...currentState]);
      
      historyRef.current.past.pop();
      
      const previousState = historyRef.current.past[historyRef.current.past.length - 1];
      
      clearDrawings();
      
      previousState.forEach(obj => fabricCanvasRef.current!.add(obj));
      
      recalculateGIA();
      
      fabricCanvasRef.current.renderOnAddRemove = true;
      fabricCanvasRef.current.renderAll();
      toast("Undo successful");
    } else {
      toast("Nothing to undo");
    }
  }, [clearDrawings]);

  const handleRedo = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    if (historyRef.current.future.length > 0) {
      fabricCanvasRef.current.renderOnAddRemove = false;
      
      const nextState = historyRef.current.future[0];
      
      historyRef.current.future.shift();
      historyRef.current.past.push([...nextState]);
      
      clearDrawings();
      
      nextState.forEach(obj => fabricCanvasRef.current!.add(obj));
      
      recalculateGIA();
      
      fabricCanvasRef.current.renderOnAddRemove = true;
      fabricCanvasRef.current.renderAll();
      toast("Redo successful");
    } else {
      toast("Nothing to redo");
    }
  }, [clearDrawings]);

  const handleZoom = useCallback((direction: "in" | "out") => {
    if (!fabricCanvasRef.current) return;
    const factor = direction === "in" ? 1.1 : 0.9;
    const newZoom = zoomLevel * factor;
    if (newZoom >= 0.5 && newZoom <= 3) {
      fabricCanvasRef.current.setZoom(newZoom);
      setZoomLevel(newZoom);
      toast(`Zoom: ${Math.round(newZoom * 100)}%`);
    }
  }, [zoomLevel]);

  const clearCanvas = useCallback(() => {
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
  }, [clearDrawings, currentFloor]);

  const saveCanvas = useCallback(() => {
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
  }, [floorPlans, currentFloor]);

  const recalculateGIA = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    let totalGIA = 0;
    const rooms = fabricCanvasRef.current.getObjects().filter(
      obj => obj.type === 'polyline' && (obj as any).objectType === 'room'
    );
    
    rooms.forEach(room => {
      const polyline = room as Polyline;
      const coords = polyline.points || [];
      if (coords.length > 2) {
        const points: Stroke = coords.map(p => ({ 
          x: p.x / PIXELS_PER_METER, 
          y: p.y / PIXELS_PER_METER 
        }));
        totalGIA += calculateGIA(points);
      }
    });
    
    setGia(totalGIA);
  }, []);

  const handleAddFloor = useCallback(() => {
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
  }, [floorPlans.length]);

  const handleSelectFloor = useCallback((index: number) => {
    if (index !== currentFloor) {
      setCurrentFloor(index);
      toast.info(`Switched to ${floorPlans[index]?.label || 'Unknown floor'}`);
    }
  }, [currentFloor, floorPlans]);

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
        
        <

