
/**
 * Custom hook for initializing the canvas
 * Handles canvas creation, brush setup, and grid initialization
 * @module useCanvasInitialization
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { 
  initializeDrawingBrush, 
  setCanvasDimensions, 
  addPressureSensitivity,
  addPinchToZoom,
  disposeCanvas
} from "@/utils/fabric";
import { createGrid } from "@/utils/canvasGrid";
import { FloorPlan } from "@/utils/drawing";

/**
 * Props for useCanvasInitialization hook
 * @interface UseCanvasInitializationProps
 */
interface UseCanvasInitializationProps {
  canvasDimensions: { width: number, height: number };
  tool: "draw" | "room" | "straightLine";
  currentFloor: number;
  setZoomLevel: (zoom: number) => void;
  setDebugInfo: React.Dispatch<React.SetStateAction<{
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  }>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
}

// Global tracker for initial toast shown
let initialToastShown = false;

/**
 * Hook for initializing the canvas and related objects
 * @param {UseCanvasInitializationProps} props - Hook properties
 * @returns {Object} Canvas and related refs
 */
export const useCanvasInitialization = ({
  canvasDimensions,
  tool,
  currentFloor,
  setZoomLevel,
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseCanvasInitializationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<any[]>([]);
  const canvasInitializedRef = useRef(false);
  const gridCreatedRef = useRef(false);
  const initializationInProgressRef = useRef(false);
  
  // History for undo/redo
  const historyRef = useRef<{past: any[][], future: any[][]}>(
    { past: [], future: [] }
  );

  // Grid creation function with memoization for better performance
  const gridRef = useCallback((canvas: FabricCanvas) => {
    if (gridCreatedRef.current && gridLayerRef.current.length > 0) {
      return gridLayerRef.current;
    }
    
    const gridObjects = createGrid(canvas, gridLayerRef, canvasDimensions, setDebugInfo, setHasError, setErrorMessage);
    if (gridObjects.length > 0) {
      gridCreatedRef.current = true;
    }
    return gridObjects;
  }, [canvasDimensions, setDebugInfo, setHasError, setErrorMessage]);

  // Initialize canvas when component mounts or when dependencies change
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    
    if (canvasInitializedRef.current && fabricCanvasRef.current) {
      console.log("Canvas already initialized, skipping initialization");
      return;
    }
    
    // Prevent concurrent initializations
    if (initializationInProgressRef.current) {
      console.log("Canvas initialization already in progress, skipping");
      return;
    }
    
    initializationInProgressRef.current = true;
    console.log("Initializing canvas with dimensions:", canvasDimensions);
    
    try {
      // PERFORMANCE OPTIMIZATIONS for Fabric.js initialization
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        backgroundColor: "#FFFFFF",
        isDrawingMode: true,
        selection: false,
        width: canvasDimensions.width,
        height: canvasDimensions.height,
        renderOnAddRemove: false,
        stateful: false,
        fireRightClick: false,
        stopContextMenu: true,
        enableRetinaScaling: false,
        perPixelTargetFind: false,
        skipOffscreen: true, // OPTIMIZATION: Skip rendering objects outside canvas viewport
        objectCaching: true, // OPTIMIZATION: Enable object caching for all objects
        imageSmoothingEnabled: false, // OPTIMIZATION: Disable image smoothing for better performance
        preserveObjectStacking: false, // OPTIMIZATION: Disable object stacking preservation for performance
        svgViewportTransformation: false // OPTIMIZATION: Disable SVG viewport transforms
      });
      
      console.log("FabricCanvas instance created");
      fabricCanvasRef.current = fabricCanvas;
      canvasInitializedRef.current = true;
      
      // Initialize the drawing brush with precise settings for drawing
      const pencilBrush = initializeDrawingBrush(fabricCanvas);
      if (pencilBrush) {
        fabricCanvas.freeDrawingBrush = pencilBrush;
        fabricCanvas.freeDrawingBrush.width = 2;
        fabricCanvas.freeDrawingBrush.color = "#000000";
        fabricCanvas.isDrawingMode = true;
        
        // OPTIMIZATION: Set brush properties for better performance
        if ('decimate' in pencilBrush) {
          (pencilBrush as any).decimate = 2; // Reduce number of points for smoother performance
        }
        
        setDebugInfo(prev => ({
          ...prev, 
          canvasInitialized: true,
          brushInitialized: true
        }));
      } else {
        console.error("Failed to initialize drawing brush");
        setDebugInfo(prev => ({
          ...prev, 
          canvasInitialized: true,
          brushInitialized: false
        }));
      }
      
      // Create grid after canvas is rendered, using idle callback
      const createGridWhenIdle = () => {
        const gridObjects = gridRef(fabricCanvas);
        
        // Now that the grid is created, enable rendering
        fabricCanvas.renderOnAddRemove = true;
        fabricCanvas.requestRenderAll();
      };
      
      // Use either requestIdleCallback or setTimeout as fallback
      if (typeof window.requestIdleCallback === 'function') {
        requestIdleCallback(createGridWhenIdle, { timeout: 500 });
      } else {
        setTimeout(createGridWhenIdle, 200);
      }
      
      // Add pressure sensitivity for Apple Pencil
      addPressureSensitivity(fabricCanvas);
      
      // Add pinch-to-zoom
      addPinchToZoom(fabricCanvas, setZoomLevel);
      
      // Optimize object:added event with throttling
      let objectAddedThrottled = false;
      const ensureGridInBackground = () => {
        if (objectAddedThrottled) return;
        
        objectAddedThrottled = true;
        setTimeout(() => {
          if (gridLayerRef.current.length === 0) {
            gridRef(fabricCanvas);
          } else {
            gridLayerRef.current.forEach(gridObj => {
              fabricCanvas.sendObjectToBack(gridObj);
            });
          }
          objectAddedThrottled = false;
        }, 100);
      };
      
      fabricCanvas.on('object:added', ensureGridInBackground);

      // Initialize history with current state only if there are actual objects
      const initialState = fabricCanvas.getObjects().filter(obj => 
        obj.type === 'path' || obj.type === 'polyline'
      );
      
      if (initialState.length > 0) {
        historyRef.current.past.push([...initialState]);
      }
      
      // Only show toast on first initialization across ALL renders
      if (!initialToastShown) {
        toast.success("Canvas ready for drawing!", {
          id: "canvas-ready",
          duration: 2000
        });
        initialToastShown = true;
      }
      
      // OPTIMIZATION: Precompile frequent canvas operations
      fabricCanvas.calcViewportBoundaries();
      
      // Initialization complete
      initializationInProgressRef.current = false;
      
      // Clean up on unmount
      return () => {
        fabricCanvas.off('object:added', ensureGridInBackground);
        
        // Don't dispose the canvas when switching floors or tools, only on component unmount
        if (fabricCanvasRef.current === fabricCanvas) {
          disposeCanvas(fabricCanvas);
          fabricCanvasRef.current = null;
          canvasInitializedRef.current = false;
          gridLayerRef.current = [];
          gridCreatedRef.current = false;
        }
      };
    } catch (err) {
      console.error("Error initializing canvas:", err);
      setHasError(true);
      setErrorMessage(`Failed to initialize canvas: ${err instanceof Error ? err.message : String(err)}`);
      toast.error("Failed to initialize canvas");
      initializationInProgressRef.current = false;
    }
  }, [canvasDimensions.width, canvasDimensions.height, gridRef, setZoomLevel, setDebugInfo, setHasError, setErrorMessage]);

  return {
    canvasRef,
    fabricCanvasRef,
    gridLayerRef,
    historyRef
  };
};
