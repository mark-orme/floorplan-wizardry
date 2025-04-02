
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
  
  // Stable handler for canvas ready event
  const handleCanvasReady = useCallback((canvas: FabricCanvas) => {
    console.log('CanvasApp: Canvas is ready, dimensions:', canvas.width, 'x', canvas.height);
    
    // Save canvas reference locally
    canvasRef.current = canvas;
    
    // Update parent component with canvas reference
    if (setCanvas && mountedRef.current) {
      setCanvas(canvas);
    }
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      canvasReady: true,
      canvasInitialized: true,
      dimensionsSet: true
    }));
  }, [setCanvas]);
  
  // Clean up on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      
      // Clear parent canvas reference on unmount
      if (setCanvas) {
        console.log('CanvasApp: Component unmounting, clearing canvas reference');
        setCanvas(null);
      }
    };
  }, [setCanvas]);
  
  return (
    <CanvasLayout>
      <Canvas 
        width={DEFAULT_CANVAS_WIDTH}
        height={DEFAULT_CANVAS_HEIGHT}
        onCanvasReady={handleCanvasReady}
        setDebugInfo={setDebugInfo}
        showGridDebug={showGridDebug}
      />
      <DrawingToolbarModals />
    </CanvasLayout>
  );
};
