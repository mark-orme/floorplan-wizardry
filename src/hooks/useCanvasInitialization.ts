
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
} from "@/utils/fabricHelpers";
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
  
  // History for undo/redo
  const historyRef = useRef<{past: any[][], future: any[][]}>(
    { past: [], future: [] }
  );

  // Grid creation function with memoization for better performance
  const gridRef = useCallback((canvas: FabricCanvas) => {
    if (gridCreatedRef.current && gridLayerRef.current.length > 0) {
      console.log("Using existing grid");
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
      console.log("Canvas ref is null, will retry later");
      return;
    }
    
    if (canvasInitializedRef.current) {
      console.log("Canvas already initialized, skipping");
      return;
    }
    
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
      
      // OPTIMIZATION: Lazy load grid for faster initial display
      requestIdleCallback(() => {
        // Create grid after canvas is rendered, during browser idle time
        const gridObjects = gridRef(fabricCanvas);
        console.log(`Grid created with ${gridObjects.length} objects`);
        
        // Now that the grid is created, enable rendering
        fabricCanvas.renderOnAddRemove = true;
        fabricCanvas.requestRenderAll();
      }, { timeout: 500 });
      
      // Add pressure sensitivity for Apple Pencil
      addPressureSensitivity(fabricCanvas);
      
      // Add pinch-to-zoom
      addPinchToZoom(fabricCanvas, setZoomLevel);
      
      // OPTIMIZATION: Use throttled object:added event with requestAnimationFrame
      const lastObjectAdded = { timestamp: 0 };
      let objectAddedRAF: number | null = null;
      
      const handleObjectAdded = () => {
        // Throttle to max 30fps for better performance
        const now = performance.now();
        if (now - lastObjectAdded.timestamp < 33) {
          if (objectAddedRAF === null) {
            objectAddedRAF = requestAnimationFrame(() => {
              ensureGridInBackground();
              objectAddedRAF = null;
            });
          }
          return;
        }
        
        lastObjectAdded.timestamp = now;
        ensureGridInBackground();
      };
      
      const ensureGridInBackground = () => {
        if (gridLayerRef.current.length === 0) {
          gridRef(fabricCanvas);
        } else {
          gridLayerRef.current.forEach(gridObj => {
            fabricCanvas.sendObjectToBack(gridObj);
          });
        }
      };
      
      fabricCanvas.on('object:added', handleObjectAdded);

      // Initialize history with current state
      const initialState = fabricCanvas.getObjects().filter(obj => 
        obj.type === 'path' || obj.type === 'polyline'
      );
      historyRef.current.past.push([...initialState]);
      
      toast.success("Canvas ready for drawing!");
      
      // OPTIMIZATION: Precompile frequent canvas operations
      fabricCanvas.calcViewportBoundaries();
      
      // Clean up on unmount
      return () => {
        if (objectAddedRAF !== null) {
          cancelAnimationFrame(objectAddedRAF);
        }
        
        if (fabricCanvas) {
          fabricCanvas.off('object:added', handleObjectAdded);
          disposeCanvas(fabricCanvas);
          fabricCanvasRef.current = null;
          canvasInitializedRef.current = false;
          gridLayerRef.current = [];
        }
      };
    } catch (err) {
      console.error("Error initializing canvas:", err);
      setHasError(true);
      setErrorMessage(`Failed to initialize canvas: ${err instanceof Error ? err.message : String(err)}`);
      toast.error("Failed to initialize canvas");
    }
  }, [canvasDimensions, tool, currentFloor, gridRef, setZoomLevel, setDebugInfo, setHasError, setErrorMessage]);

  return {
    canvasRef,
    fabricCanvasRef,
    gridLayerRef,
    historyRef
  };
};
