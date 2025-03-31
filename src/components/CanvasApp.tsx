
/**
 * Canvas application component
 * Main component that wraps the canvas with necessary UI elements
 * @module CanvasApp
 */
import { useState, useEffect } from "react";
import { Canvas } from "@/components/Canvas";
import CanvasLayout from "@/components/CanvasLayout"; 
import { DrawingToolbarModals } from "@/components/DrawingToolbarModals";
import { DEFAULT_DEBUG_STATE } from "@/types/core/DebugInfo";

/**
 * Canvas application component
 * Wraps the canvas with necessary controllers and UI
 * @returns {JSX.Element} Rendered component
 */
export const CanvasApp = (): JSX.Element => {
  const [debugInfo, setDebugInfo] = useState(() => ({
    ...DEFAULT_DEBUG_STATE,
    hasError: false,
    errorMessage: '',
    lastInitTime: 0,
    lastGridCreationTime: 0,
    canvasEventsRegistered: false,
    gridRendered: false,
    toolsInitialized: false
  }));
  
  // Debug logging for troubleshooting
  useEffect(() => {
    console.log('Grid Created:', debugInfo.gridCreated);
    console.log('Canvas Ready:', debugInfo.canvasReady);
    console.log('Canvas Initialized:', debugInfo.canvasInitialized);
  }, [debugInfo]);
  
  return (
    <CanvasLayout>
      <Canvas setDebugInfo={setDebugInfo} />
      <DrawingToolbarModals />
    </CanvasLayout>
  );
};
