
import React, { useState, useEffect } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { useCanvasDebugger } from '@/hooks/useCanvasDebugger';
import { toast } from 'sonner';
import { setupRenderTracking, getRenderCount } from '@/utils/canvas/renderTracker';

interface GridDebugPanelProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  visible?: boolean;
}

export const GridDebugPanel: React.FC<GridDebugPanelProps> = ({
  fabricCanvasRef,
  gridLayerRef,
  visible = false
}) => {
  const [showPanel, setShowPanel] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  
  // Initialize canvas debugger
  const {
    isDebugMode,
    canvasStats,
    dumpCanvasState,
    forceRender,
    forceGridVisibility,
    toggleDebugMode
  } = useCanvasDebugger({
    canvas: fabricCanvasRef.current,
    gridLayerRef,
    enabled: visible
  });
  
  // Set up render tracking
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Setup render tracking
    setupRenderTracking(canvas);
    
    // Set up render count update
    const updateInterval = setInterval(() => {
      if (canvas && showPanel) {
        setRenderCount(getRenderCount(canvas));
      }
    }, 1000);
    
    return () => {
      clearInterval(updateInterval);
    };
  }, [fabricCanvasRef, showPanel]);
  
  // Toggle panel visibility
  useEffect(() => {
    setShowPanel(visible);
  }, [visible]);
  
  // Skip rendering if panel is hidden
  if (!showPanel) return null;
  
  const handleDumpState = () => {
    const stats = dumpCanvasState();
    if (stats) {
      toast.success('Canvas stats updated');
      console.table(stats.objects.byType);
    } else {
      toast.error('Failed to generate canvas stats');
    }
  };
  
  const handleForceVisible = () => {
    const fixed = forceGridVisibility();
    if (fixed && fixed > 0) {
      toast.success(`Fixed ${fixed} grid issues`);
    } else {
      toast.info('Grid is already fully visible');
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 z-50 max-w-md text-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Grid Debugger</h3>
        <button 
          onClick={() => setShowPanel(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Close
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          <div className="text-gray-600 dark:text-gray-400">Canvas Size:</div>
          <div>
            {canvasStats?.canvas.width ?? 0} x {canvasStats?.canvas.height ?? 0}
          </div>
          
          <div className="text-gray-600 dark:text-gray-400">Total Objects:</div>
          <div>{canvasStats?.objects.total ?? 0}</div>
          
          <div className="text-gray-600 dark:text-gray-400">Grid Objects:</div>
          <div>{canvasStats?.grid.total ?? 0}</div>
          
          <div className="text-gray-600 dark:text-gray-400">Visible Grid:</div>
          <div>{canvasStats?.grid.visible ?? 0} / {canvasStats?.grid.total ?? 0}</div>
          
          <div className="text-gray-600 dark:text-gray-400">Render Count:</div>
          <div>{renderCount}</div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDumpState}
            className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
          >
            Dump State
          </button>
          
          <button
            onClick={forceRender}
            className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs"
          >
            Force Render
          </button>
          
          <button
            onClick={handleForceVisible}
            className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs"
          >
            Fix Grid
          </button>
          
          <button
            onClick={toggleDebugMode}
            className={`px-2 py-1 rounded text-xs ${
              isDebugMode 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isDebugMode ? 'Disable Debug' : 'Enable Debug'}
          </button>
        </div>
      </div>
    </div>
  );
};
