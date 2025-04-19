
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { ReliableGridLayer } from './ReliableGridLayer';
import SimpleGridLayer from './SimpleGridLayer'; // Fixed import statement
import { useAutoSaveCanvas } from '@/hooks/useAutoSaveCanvas';
import { toast } from 'sonner';
import { MobileCanvasOptimizer } from './MobileCanvasOptimizer';

interface CanvasWithReliableGridProps {
  width: number;
  height: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  gridSpacing?: number;
  showGridDebug?: boolean;
}

export const CanvasWithReliableGrid: React.FC<CanvasWithReliableGridProps> = ({
  width,
  height,
  onCanvasReady,
  gridSpacing = 20,
  showGridDebug = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [isGridCreated, setIsGridCreated] = useState(false);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || canvas) return;
    
    try {
      console.log("Initializing canvas");
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true
      });
      
      setCanvas(fabricCanvas);
      
      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }
      
      console.log("Canvas initialized successfully");
      
      return () => {
        console.log("Disposing canvas");
        fabricCanvas.dispose();
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      toast.error('Failed to initialize canvas');
    }
  }, [width, height, onCanvasReady, canvas]);
  
  // Set up auto-save
  const { saveCanvas, loadCanvas: restoreCanvas, lastSaved } = useAutoSaveCanvas({
    canvas,
    storageKey: 'canvas_reliable_grid',
    autoSaveInterval: 30000, // 30 seconds
    onSave: (success) => {
      if (!success) {
        console.error('Failed to auto-save canvas');
      }
    },
    onLoad: (success) => {
      if (success) {
        toast.success('Drawing restored!');
      }
    }
  });
  
  // Handle grid creation status
  const handleGridCreated = (created: boolean) => {
    setIsGridCreated(created);
  };
  
  // Save canvas on unmount
  useEffect(() => {
    return () => {
      if (canvas) {
        saveCanvas();
      }
    };
  }, [canvas, saveCanvas]);
  
  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="border border-gray-300 rounded shadow-sm"
      />
      
      {canvas && (
        <>
          {/* Use our more reliable SimpleGridLayer first */}
          <SimpleGridLayer canvas={canvas} />
          
          {/* Also keep the previous grid components as fallback */}
          <ReliableGridLayer 
            canvas={canvas}
            gridSpacing={gridSpacing}
            showDebugInfo={showGridDebug}
            onGridCreated={handleGridCreated}
          />
          
          {/* Add mobile optimizations */}
          <MobileCanvasOptimizer canvas={canvas} />
        </>
      )}
      
      {showGridDebug && (
        <div className="absolute top-2 right-2 bg-white/80 p-2 rounded text-xs">
          <div>Canvas: {canvas ? 'Initialized' : 'Not initialized'}</div>
          <div>Grid: {isGridCreated ? 'Created' : 'Not created'}</div>
          {lastSaved && (
            <div>Last saved: {lastSaved.toLocaleTimeString()}</div>
          )}
          <div className="flex gap-1 mt-1">
            <button 
              onClick={() => saveCanvas()}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs flex-1"
            >
              Save
            </button>
            <button 
              onClick={() => restoreCanvas()}
              className="px-2 py-1 bg-green-500 text-white rounded text-xs flex-1"
            >
              Restore
            </button>
            <button 
              onClick={() => {
                if (canvas) {
                  // Force grid creation
                  import('@/utils/simpleGridCreator').then(({ createSimpleGrid }) => {
                    const grid = createSimpleGrid(canvas);
                    setIsGridCreated(grid.length > 0);
                    toast.success(`Created grid with ${grid.length} lines`);
                  });
                }
              }}
              className="px-2 py-1 bg-purple-500 text-white rounded text-xs flex-1"
            >
              Fix Grid
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
