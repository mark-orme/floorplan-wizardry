/**
 * Canvas application component
 * Main component that wraps the canvas with necessary UI elements
 * @module CanvasApp
 */
import React from 'react';
import { useState, useEffect } from "react";
import { Canvas } from "@/components/Canvas";
import CanvasLayout from "@/components/CanvasLayout"; 
import { DrawingToolbarModals } from "@/components/DrawingToolbarModals";
import { DEFAULT_DEBUG_STATE } from "@/types/core/DebugInfo";
import type { DebugInfoState } from "@/types/core/DebugInfo";
import { Canvas as FabricCanvas } from "fabric";

// Default dimensions for the canvas
const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;

/**
 * Canvas application component
 * Wraps the canvas with necessary controllers and UI
 * @returns {JSX.Element} Rendered component
 */
export const CanvasApp = (): JSX.Element => {
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>(() => ({
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
  
  // Handler for canvas ready event
  const handleCanvasReady = (canvas: FabricCanvas) => {
    console.log('Canvas is ready');
  };
  
  return (
    <CanvasLayout>
      <Canvas 
        width={DEFAULT_CANVAS_WIDTH}
        height={DEFAULT_CANVAS_HEIGHT}
        onCanvasReady={handleCanvasReady}
        setDebugInfo={setDebugInfo}
      />
      <DrawingToolbarModals />
    </CanvasLayout>
  );
};
