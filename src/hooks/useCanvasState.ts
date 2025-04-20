import { useState, useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";
import { UseCanvasStateResult } from "@/types/canvasStateTypes";
import { loadCanvasState, saveCanvasState } from "@/utils/persistence";
import logger from "@/utils/logger";

export const useCanvasState = (): UseCanvasStateResult => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [showGridDebug, setShowGridDebug] = useState<boolean>(false);
  const [forceRefreshKey, setForceRefreshKey] = useState<number>(0);
  const [activeTool, setActiveTool] = useState(DrawingMode.SELECT);
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [lineColor, setLineColor] = useState<string>("#000000");
  
  const gridInitializedRef = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;
  const canvasStableRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);

  // Load initial canvas state
  useEffect(() => {
    if (!canvas) return;
    
    const loadSavedState = async () => {
      try {
        // Load tool settings
        const savedState = localStorage.getItem('canvas_state');
        if (savedState) {
          const state = JSON.parse(savedState);
          setActiveTool(state.activeTool || DrawingMode.SELECT);
          setLineThickness(state.lineThickness || 2);
          setLineColor(state.lineColor || "#000000");
          logger.info("Restored canvas settings from storage");
        }
        
        // Load canvas content
        await loadCanvasState(canvas);
      } catch (error) {
        logger.error("Error loading canvas state:", error);
        toast.error("Failed to restore previous drawing");
      }
    };

    loadSavedState();
    
    // Set component as mounted
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
    };
  }, [canvas]);

  // Save canvas state on changes
  useEffect(() => {
    if (!canvas) return;

    const state = {
      activeTool,
      lineThickness,
      lineColor,
    };

    try {
      localStorage.setItem('canvas_state', JSON.stringify(state));
    } catch (error) {
      logger.error("Error saving canvas state:", error);
    }
  }, [canvas, activeTool, lineThickness, lineColor]);

  // Add autosave functionality to save the canvas when changes are made
  useEffect(() => {
    if (!canvas) return;

    const saveOnChange = () => {
      if (mountedRef.current) {
        saveCanvasState(canvas);
      }
    };

    // Debounce the save to prevent too many saves
    let saveTimeout: number | null = null;
    
    const debouncedSave = () => {
      if (saveTimeout) {
        window.clearTimeout(saveTimeout);
      }
      
      saveTimeout = window.setTimeout(saveOnChange, 2000);
    };

    // Attach event listeners for canvas changes
    canvas.on('object:modified', debouncedSave);
    canvas.on('object:added', debouncedSave);
    canvas.on('object:removed', debouncedSave);

    return () => {
      // Clean up event listeners
      if (canvas) {
        canvas.off('object:modified', debouncedSave);
        canvas.off('object:added', debouncedSave);
        canvas.off('object:removed', debouncedSave);
      }
      
      // Clear any pending timeout
      if (saveTimeout) {
        window.clearTimeout(saveTimeout);
      }
    };
  }, [canvas]);

  return {
    canvas,
    setCanvas,
    showGridDebug,
    setShowGridDebug,
    forceRefreshKey,
    setForceRefreshKey,
    activeTool,
    setActiveTool,
    lineThickness,
    setLineThickness,
    lineColor,
    setLineColor,
    gridInitializedRef,
    retryCountRef,
    maxRetries,
    canvasStableRef,
    mountedRef
  };
};

// Export types from the appropriate source
export { DEFAULT_CANVAS_STATE } from "@/types/canvasStateTypes";
