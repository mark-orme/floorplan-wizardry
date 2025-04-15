
import { useRef, useState, useEffect } from "react";
import { Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { useCanvasController } from "@/components/canvas/controller/CanvasController";
import { toast } from "sonner";
import { useCanvasHistory } from "@/hooks/useCanvasHistory";
import { CanvasEventManager } from "./CanvasEventManager";
import { useAutoSaveCanvas } from "@/hooks/useAutoSaveCanvas"; 
import { useOfflineSupport } from "@/hooks/useOfflineSupport";
import { DrawingControls } from "./DrawingControls";
import { OfflineIndicator } from "./OfflineIndicator";
import { GridLayerManager } from "./GridLayerManager";
import { RestorePromptManager } from "./RestorePromptManager";

/**
 * Drawing manager component
 * Coordinates drawing tools and canvas state
 */
export const DrawingManager = () => {
  // Get canvas from context
  const { canvas } = useCanvasController();
  
  // Generate a stable canvas ID based on user session or use default
  const canvasId = useRef<string>(`default-${Math.random().toString(36).substring(2, 9)}`).current;
  
  // State for drawing tools
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineThickness, setLineThickness] = useState(2);
  const [lineColor, setLineColor] = useState("#000000");
  const [gia, setGia] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
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
  
  // Initialize offline support
  const { isOnline } = useOfflineSupport({
    canvas, 
    canvasId
  });
  
  // Initialize autosave using our refactored hook
  const { saveCanvas, restoreCanvas, lastSaved } = useAutoSaveCanvas({
    canvas,
    canvasId,
    onSave: (success) => {
      if (success) {
        console.log("Canvas autosaved successfully");
      }
    },
    onRestore: (success) => {
      if (success) {
        // After loading from autosave, update the history state
        updateHistoryState();
        toast.success('Drawing restored successfully');
      }
    }
  });
  
  // Update canUndo/canRedo based on history state
  const updateHistoryState = () => {
    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(historyRef.current.future.length > 0);
  };

  // Enhanced undo function with state update
  const handleUndo = () => {
    undo();
    updateHistoryState();
    // Save the state after undoing
    setTimeout(() => saveCanvas(), 100);
  };

  // Enhanced redo function with state update
  const handleRedo = () => {
    redo();
    updateHistoryState();
    // Save the state after redoing
    setTimeout(() => saveCanvas(), 100);
  };
  
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
    
    // Update history state
    updateHistoryState();
    
    // Save the cleared state
    saveCanvas();
    
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
    
    // Update history state
    updateHistoryState();
    
    // Save after deletion
    saveCanvas();
    
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
  
  // Notify user about offline status
  useEffect(() => {
    if (!isOnline) {
      toast.info(
        'You are currently offline. Don\'t worry - your drawings will be saved locally.',
        { duration: 5000, id: 'offline-notice' }
      );
    }
  }, [isOnline]);
  
  return (
    <div className="flex flex-col gap-2">
      <DrawingControls 
        tool={tool}
        setTool={setTool}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoom={handleZoom}
        onClear={clearCanvas}
        onDelete={deleteSelectedObjects}
        gia={gia}
        lineThickness={lineThickness}
        lineColor={lineColor}
        showGrid={showGrid}
        onToggleGrid={toggleGrid}
        onLineThicknessChange={setLineThickness}
        onLineColorChange={setLineColor}
        canUndo={canUndo}
        canRedo={canRedo}
        isOffline={!isOnline}
        lastSaved={lastSaved}
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
            undo={handleUndo}
            redo={handleRedo}
            deleteSelectedObjects={deleteSelectedObjects}
            onDrawingComplete={() => saveCanvas()}
          />
          
          <GridLayerManager
            canvas={canvas}
            showGrid={showGrid}
            onGridCreated={(objects) => {
              gridLayerRef.current = objects;
            }}
          />
        </>
      )}
      
      {/* Restore drawing prompt */}
      {canvas && (
        <RestorePromptManager
          canvas={canvas}
          canvasId={canvasId}
          onRestore={restoreCanvas}
        />
      )}
      
      <OfflineIndicator isOffline={!isOnline} />
    </div>
  );
};
