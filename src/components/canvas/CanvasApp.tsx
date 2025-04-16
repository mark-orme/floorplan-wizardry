
/**
 * Canvas application component
 * Main component that wraps the canvas with necessary UI elements
 * @module CanvasApp
 */
import { useState, useEffect, useRef } from "react";
import { CanvasWithFallback } from "@/components/canvas/CanvasWithFallback";
import CanvasLayout from "@/components/CanvasLayout"; 
import { DrawingToolbarModals } from "@/components/DrawingToolbarModals";
import { DEFAULT_DEBUG_STATE } from "@/types/core/DebugInfo";
import type { DebugInfoState } from "@/types/core/DebugInfo";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { useRealtimeCanvasSync } from "@/hooks/useRealtimeCanvasSync";
import { useCollaborationStatus } from "@/components/canvas/app/useCollaborationStatus";
import { CanvasCollaborationIndicator } from "@/components/canvas/CanvasCollaborationIndicator";

// Default dimensions for the canvas
const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;

export interface CanvasAppProps {
  setCanvas?: (canvas: FabricCanvas) => void;
  tool?: DrawingMode;
  lineThickness?: number;
  lineColor?: string;
  enableSync?: boolean;
  showGridDebug?: boolean;
}

/**
 * Canvas application component
 * Wraps the canvas with necessary controllers and UI
 * @returns {JSX.Element} Rendered component
 */
export const CanvasApp = ({
  setCanvas,
  tool = DrawingMode.SELECT,
  lineThickness = 2,
  lineColor = '#000000',
  enableSync = true,
  showGridDebug = false
}: CanvasAppProps): JSX.Element => {
  const [canvas, setLocalCanvas] = useState<FabricCanvas | null>(null);
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
  
  // Set up real-time sync using the hook
  const { collaborators, syncCanvas } = useRealtimeCanvasSync({
    canvas: canvas,
    enabled: enableSync,
    onRemoteUpdate: (sender, timestamp) => {
      console.log(`Canvas updated by ${sender} at ${new Date(timestamp).toLocaleString()}`);
    }
  });
  
  // Use collaboration status hook to show toast notifications
  useCollaborationStatus({
    collaborators,
    enableSync
  });
  
  // Handler for canvas ready event
  const handleCanvasReady = (fabricCanvas: FabricCanvas) => {
    console.log('Canvas is ready');
    setLocalCanvas(fabricCanvas);
    
    if (setCanvas) {
      setCanvas(fabricCanvas);
    }
    
    // Sync the initial canvas state
    if (enableSync) {
      setTimeout(() => {
        syncCanvas('User');
      }, 1000);
    }
  };

  // Handle canvas error
  const handleCanvasError = (err: Error) => {
    console.error('Canvas error:', err);
    setDebugInfo(prev => ({
      ...prev,
      hasError: true,
      errorMessage: err.message
    }));
  };
  
  return (
    <CanvasLayout>
      <div className="relative w-full h-full">
        <CanvasWithFallback 
          width={DEFAULT_CANVAS_WIDTH}
          height={DEFAULT_CANVAS_HEIGHT}
          tool={tool}
          lineThickness={lineThickness}
          lineColor={lineColor}
          onCanvasReady={handleCanvasReady}
          onError={handleCanvasError}
          className="w-full h-full"
        />
        
        {/* Collaboration indicator for real-time editing */}
        <CanvasCollaborationIndicator 
          collaborators={collaborators} 
          enabled={enableSync}
        />
        
        <DrawingToolbarModals />
      </div>
    </CanvasLayout>
  );
};
