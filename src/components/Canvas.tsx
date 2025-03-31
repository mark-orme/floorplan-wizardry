
/**
 * Main Canvas component that integrates with Fabric.js
 * @module components/Canvas
 */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";
import logger from "@/utils/logger";
import { BasicGrid } from "./BasicGrid";
import { DebugInfoState, DEFAULT_DEBUG_STATE } from "@/types/core/DebugInfo";
import { useStraightLineTool } from "@/hooks/straightLineTool";
import { useCanvasReadyState } from "@/utils/canvas/canvasReadyState";

/**
 * Props for Canvas component
 */
interface CanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  setDebugInfo?: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  tool?: DrawingMode;
}

/**
 * Main Canvas component 
 * Creates and manages a Fabric.js canvas instance
 */
export const Canvas: React.FC<CanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onError,
  setDebugInfo,
  tool
}) => {
  const { lineColor, lineThickness } = useDrawingContext();
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [localDebugInfo, setLocalDebugInfo] = useState<DebugInfoState>(DEFAULT_DEBUG_STATE);
  const gridLayerRef = useRef<any[]>([]);
  const canvasInitializedRef = useRef<boolean>(false);
  
  // Canvas ready state tracking
  const { 
    isReady,
    setCanvasCreated, 
    setCanvasInitialized, 
    setGridLoaded, 
    setToolsRegistered 
  } = useCanvasReadyState();
  
  // Update parent debugInfo if provided
  useEffect(() => {
    if (setDebugInfo) {
      setDebugInfo(localDebugInfo);
    }
  }, [localDebugInfo, setDebugInfo]);
  
  // Helper to update debug info - now memoized to prevent excessive re-renders
  const updateDebugInfo = useCallback((update: Partial<DebugInfoState>) => {
    setLocalDebugInfo(prev => ({
      ...prev,
      ...update
    }));
  }, []);
  
  // Save canvas state for undo/redo
  const saveCurrentState = useCallback(() => {
    if (!canvas) return;
    
    // This would be implemented with history state tracking
    console.log("Saving current canvas state");
  }, [canvas]);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Mark canvas element as created
    setCanvasCreated(true);
    
    // Prevent multiple initializations of the same canvas element
    if (canvasInitializedRef.current || canvas) {
      logger.info("Canvas already initialized, skipping initialization");
      return;
    }
    
    try {
      logger.info("Initializing canvas with dimensions:", { width, height });
      console.log("Initializing canvas with dimensions:", width, height);
      
      updateDebugInfo({ canvasCreated: true });
      
      // Check if canvas element already has a Fabric.js instance
      if (canvasRef.current._fabric) {
        logger.warn("Canvas element already has a Fabric.js instance");
        const existingCanvas = canvasRef.current._fabric as FabricCanvas;
        setCanvas(existingCanvas);
        canvasInitializedRef.current = true;
        setCanvasInitialized(true);
        
        if (onCanvasReady) {
          onCanvasReady(existingCanvas);
        }
        
        updateDebugInfo({ 
          canvasInitialized: true, 
          brushInitialized: true,
          dimensionsSet: true,
          canvasReady: true
        });
        
        return;
      }
      
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#ffffff",
        selection: tool === DrawingMode.SELECT
      });
      
      // Initialize the drawing brush
      fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = lineColor;
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      
      updateDebugInfo({ 
        canvasInitialized: true, 
        brushInitialized: true,
        dimensionsSet: true
      });
      
      setCanvas(fabricCanvas);
      canvasInitializedRef.current = true;
      setCanvasInitialized(true);
      
      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }
      
      updateDebugInfo({ canvasReady: true });
      
      logger.info("Canvas initialized successfully");
      console.log("Canvas initialized successfully");
      
      // Mark tools as registered once canvas is initialized
      setToolsRegistered(true);
      
      toast.success("Canvas ready", {
        id: "canvas-ready-toast"
      });
    } catch (error) {
      logger.error("Error initializing canvas:", error);
      console.error("Error initializing canvas:", error);
      
      if (onError && error instanceof Error) {
        onError(error);
      }
      
      toast.error("Failed to initialize canvas");
    }
    
    return () => {
      if (canvas) {
        try {
          canvas.dispose();
          canvasInitializedRef.current = false;
          logger.info("Canvas disposed");
        } catch (error) {
          logger.error("Error disposing canvas:", error);
        }
      }
    };
  }, [width, height, updateDebugInfo, onCanvasReady, onError, canvas, tool, lineColor, lineThickness, setCanvasCreated, setCanvasInitialized, setToolsRegistered]);
  
  // Update drawing mode when tool changes
  useEffect(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;
    
    // Update brush settings if in drawing mode
    if (tool === DrawingMode.DRAW) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    canvas.requestRenderAll();
    
    updateDebugInfo({ eventHandlersSet: true });
  }, [canvas, tool, lineColor, lineThickness, updateDebugInfo]);
  
  // Initialize the straight line tool - ensure this hook is called unconditionally
  const fabricCanvasRef = { current: canvas };
  const { isDrawing: isStraightLineDrawing } = useStraightLineTool({
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Handle grid creation callback - memoized to prevent creating new functions on each render
  const handleGridCreated = useCallback((gridObjects: any[]) => {
    console.log(`Grid created with ${gridObjects.length} objects`);
    
    // Store grid objects in ref to avoid re-renders
    gridLayerRef.current = gridObjects;
    
    // Mark grid as loaded
    setGridLoaded(true);
    
    // Update debug info once, not on every render
    updateDebugInfo({ 
      gridCreated: true,
      gridObjectCount: gridObjects.length
    });
  }, [updateDebugInfo, setGridLoaded]);
  
  return (
    <div className="relative">
      {/* Canvas loading overlay */}
      {!isReady && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <div className="text-sm text-muted-foreground">
              {!canvasInitializedRef.current ? 'Initializing Canvas...' : 'Loading Grid...'}
            </div>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} className="border border-gray-200" />
      
      {canvas && (
        <BasicGrid 
          canvas={canvas} 
          onGridCreated={handleGridCreated} 
        />
      )}
      
      {/* Debug overlay */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 right-0 bg-black/30 text-white p-2 text-xs">
          <div>Canvas Ready: {isReady ? '✅' : '❌'}</div>
          <div>Canvas Init: {canvasInitializedRef.current ? '✅' : '❌'}</div>
          <div>Grid Created: {localDebugInfo.gridCreated ? '✅' : '❌'}</div>
          <div>Grid Objects: {localDebugInfo.gridObjectCount}</div>
          <div>Tool: {tool}</div>
          <div>Line Drawing: {isStraightLineDrawing ? 'Active' : 'Inactive'}</div>
        </div>
      )}
    </div>
  );
};
