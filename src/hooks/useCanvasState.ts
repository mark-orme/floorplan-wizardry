
import { useState, useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { DrawingTool, UseCanvasStateResult } from "@/types/canvasStateTypes";

export const useCanvasState = (): UseCanvasStateResult => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [showGridDebug, setShowGridDebug] = useState<boolean>(false);
  const [forceRefreshKey, setForceRefreshKey] = useState<number>(0);
  const [activeTool, setActiveTool] = useState<DrawingTool>(DrawingMode.SELECT);
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [lineColor, setLineColor] = useState<string>("#000000");
  
  const gridInitializedRef = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;
  const canvasStableRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);
  
  // Reset canvas initialization state when the page loads
  useEffect(() => {
    console.log("Index page mounted - resetting initialization state");
    resetInitializationState();
    gridInitializedRef.current = false;
    canvasStableRef.current = false;
    retryCountRef.current = 0;
    mountedRef.current = true;
    
    // Log a welcome message
    toast.success("Floor Plan Editor loaded with enhanced grid system", {
      duration: 3000,
      id: "floor-plan-welcome"
    });
    
    return () => {
      console.log("Index page unmounting - cleanup");
      mountedRef.current = false;
    };
  }, [forceRefreshKey]);
  
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

// Re-export the types for backward compatibility
export { DrawingTool, CanvasState, DEFAULT_CANVAS_STATE } from "@/types/canvasStateTypes";
export type { UseCanvasStateResult } from "@/types/canvasStateTypes";
