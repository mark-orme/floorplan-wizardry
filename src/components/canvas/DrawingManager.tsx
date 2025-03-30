
import { useRef, useState } from "react";
import { Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { useCanvasController } from "@/components/canvas/controller/CanvasController";
import { toast } from "sonner";
import { SimpleGrid } from "@/components/canvas/grid/SimpleGrid";
import { useCanvasHistory } from "@/hooks/useCanvasHistory";
import { ToolbarContainer } from "./ToolbarContainer";
import { CanvasEventManager } from "./CanvasEventManager";

/**
 * Drawing manager component
 * Coordinates drawing tools and canvas state
 */
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
      <ToolbarContainer 
        tool={tool}
        setTool={setTool}
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
        <>
          <CanvasEventManager 
            canvas={canvas}
            tool={tool}
            lineThickness={lineThickness}
            lineColor={lineColor}
            gridLayerRef={gridLayerRef}
            saveCurrentState={saveCurrentState}
            undo={undo}
            redo={redo}
            deleteSelectedObjects={deleteSelectedObjects}
          />
          
          <SimpleGrid
            canvas={canvas}
            showControls={false}
            defaultVisible={showGrid}
            onGridCreated={(objects) => {
              gridLayerRef.current = objects;
            }}
          />
        </>
      )}
    </div>
  );
};
