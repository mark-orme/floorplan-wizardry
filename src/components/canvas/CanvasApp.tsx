
import React, { useEffect, useState, useRef } from 'react';
import { Canvas as FabricCanvas, ActiveSelection } from 'fabric';
import { CanvasEventManager } from './CanvasEventManager';
import { TouchGestureHandler } from './TouchGestureHandler';
import { ToolVisualizer } from './ToolVisualizer';
import { useCanvasHistory } from '@/hooks/canvas/useCanvasHistory';
import { usePerUserCanvasHistory } from '@/hooks/usePerUserCanvasHistory';
import { useDrawingContext } from '@/contexts/DrawingContext';
import { useApplePencilSupport } from '@/hooks/canvas/useApplePencilSupport';
import { updateGridWithZoom } from '@/utils/grid/gridVisibility';
import { DrawingMode } from '@/constants/drawingModes';
import { optimizeCanvasPerformance, requestOptimizedRender } from '@/utils/canvas/renderOptimizer';
import { usePusher } from '@/hooks/usePusher';
import { toast } from 'sonner';
import { SYNC_CHANNEL } from '@/utils/syncService';
import { useAuth } from '@/contexts/AuthContext';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useRealtimeCanvasSync } from '@/hooks/useRealtimeCanvasSync';

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
  const [localCollaborators, setLocalCollaborators] = useState(0);
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
  
  // Update canvas dimensions based on container size
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      // Use container dimensions if props not provided
      const newWidth = propWidth || containerRef.current.clientWidth;
      const newHeight = propHeight || containerRef.current.clientHeight;
      
      setDimensions({
        width: Math.max(newWidth, 100), // min width 100px
        height: Math.max(newHeight, 100) // min height 100px
      });
      
      // Update canvas size if it exists
      if (fabricCanvas) {
        fabricCanvas.setDimensions({
          width: Math.max(newWidth, 100),
          height: Math.max(newHeight, 100)
        });
        
        // Update grid with new dimensions
        updateGridWithZoom(fabricCanvas);
        requestOptimizedRender(fabricCanvas, 'resize');
      }
    };
    
    // Initial update
    updateDimensions();
    
    // Listen for window resize
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [fabricCanvas, containerRef, propWidth, propHeight, windowWidth, windowHeight]);
  
  // Set up real-time canvas synchronization
  const { collaborators, lastSyncTime, syncCanvas } = useRealtimeCanvasSync({
    canvas: fabricCanvas,
    enabled: enableSync,
    onRemoteUpdate: (sender, timestamp) => {
      console.log(`Received canvas update from ${sender} at ${new Date(timestamp).toLocaleTimeString()}`);
    }
  });
  
  // Show collaboration status
  useEffect(() => {
    if (enableSync && collaborators > 0) {
      toast.success(`${collaborators} other ${collaborators === 1 ? 'user' : 'users'} editing`, {
        id: 'collab-status',
        duration: 3000
      });
    }
  }, [collaborators, enableSync]);
  
  // Initialize canvas with performance optimizations
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new FabricCanvas(canvasRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      renderOnAddRemove: false // Disable automatic rendering for better control
    });
    
    // Add zoom event listener for grid scaling
    canvas.on('zoom:changed', () => {
      updateGridWithZoom(canvas);
      requestOptimizedRender(canvas, 'zoom');
    });
    
    // Apply performance optimizations
    optimizeCanvasPerformance(canvas);
    
    setFabricCanvas(canvas);
    setCanvas(canvas);
    
    return () => {
      canvas.dispose();
    };
  }, [setCanvas, dimensions.width, dimensions.height]);
  
  // Create a deleteSelectedObjects function
  const deleteSelectedObjects = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) return;
    
    if (activeObject.type === 'activeSelection') {
      const activeSelection = activeObject as ActiveSelection;
      activeSelection.forEachObject((obj) => {
        fabricCanvas.remove(obj);
      });
      fabricCanvas.discardActiveObject();
    } else {
      fabricCanvas.remove(activeObject);
    }
    
    // Use optimized render instead of direct rendering
    requestOptimizedRender(fabricCanvas, 'delete');
  };
  
  // Set up per-user canvas history management when collaboration is enabled
  const { 
    undo: perUserUndo, 
    redo: perUserRedo, 
    saveCurrentState: perUserSaveState,
    deleteSelectedObjects: perUserDeleteSelectedObjects
  } = usePerUserCanvasHistory({
    canvas: fabricCanvas,
    userId: userId
  });
  
  // Set up regular canvas history when collaboration is disabled
  const { 
    undo: regularUndo, 
    redo: regularRedo, 
    saveCurrentState: regularSaveState,
    deleteSelectedObjects: regularDeleteSelectedObjects
  } = useCanvasHistory({
    canvas: fabricCanvas
  });
  
  // Use the appropriate history management based on enableSync
  const undo = enableSync ? perUserUndo : regularUndo;
  const redo = enableSync ? perUserRedo : regularRedo;
  const saveCurrentState = enableSync ? perUserSaveState : regularSaveState;
  const historyDeleteSelectedObjects = enableSync ? perUserDeleteSelectedObjects : regularDeleteSelectedObjects;
  
  // Get Apple Pencil support
  const { isApplePencil } = useApplePencilSupport({
    canvas: fabricCanvas,
    lineThickness
  });
  
  // Set cursor based on current tool
  useEffect(() => {
    if (!fabricCanvas || !canvasRef.current) return;
    
    switch (tool) {
      case DrawingMode.SELECT:
        canvasRef.current.style.cursor = 'default';
        break;
      case DrawingMode.DRAW:
        canvasRef.current.style.cursor = 'crosshair';
        break;
      case DrawingMode.HAND:
        canvasRef.current.style.cursor = 'grab';
        break;
      case DrawingMode.ERASER:
        canvasRef.current.style.cursor = 'cell';
        break;
      default:
        canvasRef.current.style.cursor = 'crosshair';
    }
  }, [fabricCanvas, tool]);
  
  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {enableSync && collaborators > 0 && (
        <div className="absolute top-2 right-2 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
          {collaborators} {collaborators === 1 ? 'user' : 'users'} collaborating
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        className="touch-manipulation border border-gray-200 w-full h-full"
        data-testid="canvas"
      />
      
      {fabricCanvas && (
        <>
          <CanvasEventManager
            canvas={fabricCanvas}
            tool={tool}
            lineColor={lineColor}
            lineThickness={lineThickness}
            gridLayerRef={gridLayerRef}
            saveCurrentState={saveCurrentState}
            undo={undo}
            redo={redo}
            deleteSelectedObjects={historyDeleteSelectedObjects}
            enableSync={enableSync}
            onDrawingComplete={syncCanvas}
          />
          
          <TouchGestureHandler 
            canvas={fabricCanvas} 
            lineThickness={lineThickness}
            tool={tool}
          />
          
          <ToolVisualizer 
            tool={tool}
            isApplePencil={isApplePencil}
          />
        </>
      )}
    </div>
  );
};
