
/**
 * Canvas application component
 * Main component that wraps the canvas with necessary UI elements
 * @module CanvasApp
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Canvas } from "@/components/Canvas";
import CanvasLayout from "@/components/CanvasLayout"; 
import { DrawingToolbarModals } from "@/components/DrawingToolbarModals";
import { DEFAULT_DEBUG_STATE } from "@/types/core/DebugInfo";
import type { DebugInfoState } from "@/types/core/DebugInfo";
import { Canvas as FabricCanvas } from "fabric";
import { forceGridCreationAndVisibility } from "@/utils/grid/gridVisibility";
import { toast } from "sonner";

// Default dimensions for the canvas
const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;

interface CanvasAppProps {
  setCanvas?: (canvas: FabricCanvas | null) => void;
  showGridDebug?: boolean;
}

/**
 * Canvas application component
 * Wraps the canvas with necessary controllers and UI
 * @returns {JSX.Element} Rendered component
 */
export const CanvasApp = ({ setCanvas, showGridDebug = true }: CanvasAppProps): JSX.Element => {
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>(() => ({
    ...DEFAULT_DEBUG_STATE,
    hasError: false,
    errorMessage: '',
    lastInitTime: Date.now(),
    lastGridCreationTime: 0,
    canvasEventsRegistered: false,
    gridRendered: false,
    toolsInitialized: false
  }));
  
  const canvasRef = useRef<FabricCanvas | null>(null);
  const mountedRef = useRef<boolean>(true);
  const [key, setKey] = useState<number>(0);
  
  // Stable handler for canvas ready event
  const handleCanvasReady = useCallback((canvas: FabricCanvas) => {
    if (!mountedRef.current) return;
    
    // Save canvas reference locally
    canvasRef.current = canvas;
    
    // Update parent component with canvas reference
    if (setCanvas) {
      setCanvas(canvas);
    }
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      canvasReady: true,
      canvasInitialized: true,
      dimensionsSet: true
    }));
    
    // Force grid creation after a short delay
    setTimeout(() => {
      if (mountedRef.current && canvas) {
        forceGridCreationAndVisibility(canvas);
        canvas.renderAll();
        toast.success("Canvas initialized");
      }
    }, 1000);
  }, [setCanvas]);
  
  // Reset canvas on error
  const resetCanvas = useCallback(() => {
    setKey(prev => prev + 1);
    
    setTimeout(() => {
      if (canvasRef.current) {
        forceGridCreationAndVisibility(canvasRef.current);
      }
    }, 500);
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      
      // Clear parent canvas reference on unmount
      if (setCanvas) {
        setCanvas(null);
      }
    };
  }, [setCanvas]);
  
  return (
    <CanvasLayout>
      <Canvas 
        key={`canvas-${key}`}
        width={DEFAULT_CANVAS_WIDTH}
        height={DEFAULT_CANVAS_HEIGHT}
        onCanvasReady={handleCanvasReady}
        setDebugInfo={setDebugInfo}
        showGridDebug={showGridDebug}
      />
      <div className="absolute bottom-4 right-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={resetCanvas}
        >
          Reset Canvas
        </button>
      </div>
      <DrawingToolbarModals />
    </CanvasLayout>
  );
};
