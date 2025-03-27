
/**
 * Grid Debug Panel Component
 * Shows real-time information about the canvas grid
 * @module canvas/grid/GridDebugPanel
 */
import React, { useState, useEffect } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { X, RefreshCw, ZoomIn, Grid } from 'lucide-react';
import { dumpGridState, forceCreateGrid } from '@/utils/grid/gridDebugUtils';

/**
 * Props for the GridDebugPanel component
 * @interface GridDebugPanelProps
 */
interface GridDebugPanelProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Whether the panel is visible */
  visible?: boolean;
}

/**
 * Grid debug panel component
 * Displays real-time grid statistics and provides utilities for grid management
 * 
 * @param {GridDebugPanelProps} props - Component properties
 * @returns {JSX.Element | null} Rendered component
 */
export function GridDebugPanel({ 
  fabricCanvasRef, 
  gridLayerRef, 
  visible = false 
}: GridDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(visible);
  const [gridStats, setGridStats] = useState({
    canvasWidth: 0,
    canvasHeight: 0,
    totalGridObjects: 0,
    objectsOnCanvas: 0
  });
  
  // Update grid statistics
  useEffect(() => {
    if (!isOpen) return;
    
    const updateStats = () => {
      const canvas = fabricCanvasRef.current;
      
      if (!canvas) {
        setGridStats({
          canvasWidth: 0,
          canvasHeight: 0,
          totalGridObjects: 0,
          objectsOnCanvas: 0
        });
        return;
      }
      
      // Count grid objects on canvas
      const gridObjects = gridLayerRef.current;
      const objectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj)).length;
      
      setGridStats({
        canvasWidth: canvas.width || 0,
        canvasHeight: canvas.height || 0,
        totalGridObjects: gridObjects.length,
        objectsOnCanvas
      });
    };
    
    // Update initially and on interval
    updateStats();
    const interval = setInterval(updateStats, 2000);
    
    return () => clearInterval(interval);
  }, [isOpen, fabricCanvasRef, gridLayerRef]);
  
  if (!isOpen) {
    return (
      <Button
        className="absolute bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full"
        onClick={() => setIsOpen(true)}
        title="Show Grid Debug Panel"
      >
        <Grid className="h-4 w-4" />
      </Button>
    );
  }
  
  // Handle force grid creation
  const handleForceCreateGrid = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    forceCreateGrid(canvas, gridLayerRef);
  };
  
  // Handle grid inspection
  const handleInspectGrid = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    dumpGridState(canvas, gridLayerRef.current);
  };
  
  const gridHealth = gridStats.totalGridObjects > 0 &&
                    gridStats.objectsOnCanvas === gridStats.totalGridObjects;

  return (
    <div className="absolute bottom-4 right-4 p-4 bg-white border border-gray-300 rounded-lg shadow-lg w-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Grid Debug Panel</h3>
        <Button 
          variant="ghost" 
          className="h-6 w-6 p-0"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Canvas dimensions:</span>
          <span>{gridStats.canvasWidth}×{gridStats.canvasHeight}px</span>
        </div>
        <div className="flex justify-between">
          <span>Grid objects:</span>
          <span>{gridStats.totalGridObjects}</span>
        </div>
        <div className="flex justify-between">
          <span>Grid objects on canvas:</span>
          <span>{gridStats.objectsOnCanvas}</span>
        </div>
        <div className="flex justify-between">
          <span>Grid health:</span>
          <span className={gridHealth ? "text-green-500" : "text-red-500"}>
            {gridHealth ? "Good" : "Issues detected"}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between mt-4 gap-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleInspectGrid}
          className="text-xs flex-1"
        >
          <ZoomIn className="h-3 w-3 mr-1" />
          Inspect Grid
        </Button>
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleForceCreateGrid}
          className="text-xs flex-1"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Force Create Grid
        </Button>
      </div>
    </div>
  );
}
