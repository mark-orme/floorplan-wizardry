
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { CanvasToolbar } from "./CanvasToolbar";
import { DrawingMode } from "@/constants/drawingModes";
import { useCanvasController } from "@/components/canvas/controller/CanvasController";
import { toast } from "sonner";
import { SimpleGrid } from "@/components/canvas/grid/SimpleGrid";
import { useCanvasHistory } from "@/hooks/useCanvasHistory";

export const DrawingManager = () => {
  // Get canvas from context
  const { canvas } = useCanvasController();
  
  // State for drawing tools
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineThickness, setLineThickness] = useState(2);
  const [lineColor, setLineColor] = useState("#000000");
  const [gia, setGia] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  
  // Grid objects reference
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // History for undo/redo
  const historyRef = useRef<{past: FabricObject[][], future: FabricObject[][]}>({
    past: [],
    future: []
  });
  
  // Initialize history manager
  const { saveCurrentState, undo, redo } = useCanvasHistory({
    fabricCanvasRef: { current: canvas },
    historyRef
  });
  
  // Effect to set up canvas event listeners
  useEffect(() => {
    if (!canvas) return;
    
    // Save initial state
    saveCurrentState();
    
    // Set up history tracking
    const handleObjectModified = () => {
      saveCurrentState();
    };
    
    const handleObjectAdded = () => {
      saveCurrentState();
    };
    
    // Add event listeners
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    
    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        redo();
      }
      
      // Delete: Delete key when in select mode
      if (e.key === 'Delete' && tool === DrawingMode.SELECT) {
        e.preventDefault();
        deleteSelectedObjects();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, tool]);
  
  // Effect to handle tool changes
  useEffect(() => {
    if (!canvas) return;
    
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
        canvas.freeDrawingBrush.width = lineThickness;
        canvas.freeDrawingBrush.color = lineColor;
        canvas.defaultCursor = 'crosshair';
        break;
        
      case DrawingMode.HAND:
        canvas.defaultCursor = 'grab';
        canvas.hoverCursor = 'grab';
        // Enable panning mode
        break;
        
      case DrawingMode.STRAIGHT_LINE:
      case DrawingMode.ROOM:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        break;
        
      case DrawingMode.ERASER:
        canvas.defaultCursor = 'cell';
        canvas.hoverCursor = 'cell';
        break;
    }
    
    // Ensure grid stays at the bottom
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.sendObjectToBack(obj);
        }
      });
    }
    
    toast(`Tool changed to ${tool}`);
    
  }, [tool, lineThickness, lineColor, canvas]);
  
  // Handle zoom
  const handleZoom = (direction: "in" | "out") => {
    if (!canvas) return;
    
    const currentZoom = canvas.getZoom();
    const zoomFactor = direction === "in" ? 1.2 : 0.8;
    const newZoom = currentZoom * zoomFactor;
    
    // Apply zoom
    canvas.setZoom(newZoom);
    canvas.requestRenderAll();
    
    toast(`Zoom ${direction}: ${Math.round(newZoom * 100)}%`);
  };
  
  // Clear canvas
  const clearCanvas = () => {
    if (!canvas) return;
    
    // Save current state before clearing
    saveCurrentState();
    
    // Remove all objects except grid
    const objectsToRemove = canvas.getObjects().filter(obj => 
      !gridLayerRef.current.includes(obj)
    );
    
    canvas.remove(...objectsToRemove);
    canvas.requestRenderAll();
    
    toast('Canvas cleared');
  };
  
  // Delete selected objects
  const deleteSelectedObjects = () => {
    if (!canvas) return;
    
    const selectedObjects = canvas.getActiveObjects();
    if (selectedObjects.length === 0) return;
    
    // Save current state before deleting
    saveCurrentState();
    
    // Remove selected objects
    canvas.remove(...selectedObjects);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    
    toast(`Deleted ${selectedObjects.length} object(s)`);
  };
  
  // Toggle grid visibility
  const toggleGrid = () => {
    setShowGrid(!showGrid);
    
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        obj.set('visible', !showGrid);
      });
      
      if (canvas) {
        canvas.requestRenderAll();
      }
    }
    
    toast(showGrid ? 'Grid hidden' : 'Grid shown');
  };
  
  return (
    <div className="flex flex-col gap-2">
      <CanvasToolbar 
        tool={tool}
        onToolChange={setTool}
        onUndo={undo}
        onRedo={redo}
        onZoom={handleZoom}
        onClear={clearCanvas}
        onDelete={deleteSelectedObjects}
        gia={gia}
        lineThickness={lineThickness}
        lineColor={lineColor}
        showGrid={showGrid}
        onToggleGrid={toggleGrid}
      />
      
      {canvas && (
        <SimpleGrid
          canvas={canvas}
          showControls={false}
          defaultVisible={showGrid}
          onGridCreated={(objects) => {
            gridLayerRef.current = objects;
          }}
        />
      )}
    </div>
  );
};
