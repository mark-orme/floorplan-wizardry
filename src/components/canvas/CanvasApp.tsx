
import React, { useState, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useDrawingContext } from '@/contexts/DrawingContext';
import { useApplePencilSupport } from '@/hooks/canvas/useApplePencilSupport';
import { DrawingMode } from '@/constants/drawingModes';
import { useAuth } from '@/contexts/AuthContext';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useRealtimeCanvasSync } from '@/hooks/useRealtimeCanvasSync';
import { CanvasInitializer } from './app/CanvasInitializer';
import { CanvasCollaborationIndicator } from './app/CanvasCollaborationIndicator';
import { CanvasTools } from './app/CanvasTools';
import { useDimensionsManager } from './app/useDimensionsManager';
import { useCanvasToolCursor } from './app/useCanvasToolCursor';
import { useSelectionManager } from './app/useSelectionManager';
import { useCanvasHistoryManagement } from './app/useCanvasHistoryManagement';
import { useCollaborationStatus } from './app/useCollaborationStatus';

interface CanvasAppProps {
  setCanvas: (canvas: FabricCanvas) => void;
  width?: number;
  height?: number;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  enableSync?: boolean; // Enable real-time collaboration
}

export const CanvasApp: React.FC<CanvasAppProps> = ({ 
  setCanvas,
  width: propWidth,
  height: propHeight,
  tool: externalTool,
  lineColor: externalLineColor,
  lineThickness: externalLineThickness,
  enableSync = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const { tool: contextTool, lineColor: contextLineColor, lineThickness: contextLineThickness } = useDrawingContext();
  const gridLayerRef = useRef<any[]>([]);
  const localCollaboratorsRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: propWidth || 800, height: propHeight || 600 });
  
  // Get window size for responsive behavior
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  
  // Get user information
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  
  // Use external props if provided, otherwise use context values
  const tool = externalTool || contextTool;
  const lineColor = externalLineColor || contextLineColor;
  const lineThickness = externalLineThickness || contextLineThickness;
  
  // Manage canvas dimensions
  useDimensionsManager({
    containerRef,
    fabricCanvas,
    propWidth,
    propHeight,
    windowWidth,
    windowHeight,
    setDimensions
  });
  
  // Set up real-time canvas synchronization
  const { collaborators, lastSyncTime, syncCanvas } = useRealtimeCanvasSync({
    canvas: fabricCanvas,
    enabled: enableSync,
    onRemoteUpdate: (sender, timestamp) => {
      console.log(`Received canvas update from ${sender} at ${new Date(timestamp).toLocaleTimeString()}`);
    }
  });
  
  // Show collaboration status
  useCollaborationStatus({
    collaborators,
    enableSync
  });
  
  // Set cursor based on current tool
  useCanvasToolCursor({
    fabricCanvas,
    canvasRef,
    tool
  });
  
  // Handle selection deletion
  const { deleteSelectedObjects } = useSelectionManager(fabricCanvas);
  
  // Manage canvas history
  const {
    undo,
    redo,
    saveCurrentState,
    historyDeleteSelectedObjects
  } = useCanvasHistoryManagement({
    fabricCanvas,
    userId,
    enableSync
  });
  
  // Get Apple Pencil support
  const { isApplePencil } = useApplePencilSupport({
    canvas: fabricCanvas,
    lineThickness
  });
  
  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <CanvasCollaborationIndicator 
        collaborators={collaborators}
        enabled={enableSync}
      />
      
      <canvas 
        ref={canvasRef} 
        className="touch-manipulation border border-gray-200 w-full h-full"
        data-testid="canvas"
      />
      
      <CanvasInitializer
        canvasRef={canvasRef}
        dimensions={dimensions}
        setFabricCanvas={setFabricCanvas}
        setCanvas={setCanvas}
      />
      
      {fabricCanvas && (
        <CanvasTools
          canvas={fabricCanvas}
          tool={tool}
          lineColor={lineColor}
          lineThickness={lineThickness}
          gridLayerRef={gridLayerRef}
          saveCurrentState={saveCurrentState}
          undo={undo}
          redo={redo}
          deleteSelectedObjects={historyDeleteSelectedObjects}
          isApplePencil={isApplePencil}
          enableSync={enableSync}
          onDrawingComplete={syncCanvas}
        />
      )}
    </div>
  );
};
