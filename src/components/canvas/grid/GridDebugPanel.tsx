
import React, { useState, useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Bug, Grid, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { dumpGridState } from "@/utils/grid/gridDebugUtils";
import { runGridDiagnostics, applyGridFixes } from "@/utils/grid/gridDiagnostics";

interface GridDebugPanelProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  visible: boolean;
}

export const GridDebugPanel: React.FC<GridDebugPanelProps> = ({
  fabricCanvasRef,
  gridLayerRef,
  visible
}) => {
  const [expanded, setExpanded] = useState(false);
  const [gridInfo, setGridInfo] = useState<any>(null);
  
  // Get grid information
  const refreshGridInfo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Run diagnostics
    const diagnostics = runGridDiagnostics(canvas);
    
    // Count objects
    const allObjects = canvas.getObjects();
    const gridObjects = allObjects.filter(obj => obj.objectType === 'grid');
    const drawingObjects = allObjects.filter(obj => obj.objectType !== 'grid');
    
    setGridInfo({
      ...diagnostics,
      totalObjects: allObjects.length,
      gridObjects: gridObjects.length,
      drawingObjects: drawingObjects.length,
      gridRefCount: gridLayerRef.current.length,
      timestamp: new Date().toISOString()
    });
  }, [fabricCanvasRef, gridLayerRef]);
  
  // Fix grid issues
  const handleFixGrid = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Run diagnostics
    const diagnostics = runGridDiagnostics(canvas);
    
    // Apply fixes
    const fixedGrid = applyGridFixes(canvas, diagnostics);
    
    // Update grid layer reference
    gridLayerRef.current = fixedGrid;
    
    // Refresh grid info
    refreshGridInfo();
  }, [fabricCanvasRef, gridLayerRef, refreshGridInfo]);
  
  // Dump grid state to console
  const handleDumpGridState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    dumpGridState(canvas); // Fixed: removed second argument
    console.log("Grid layer ref:", gridLayerRef.current);
  }, [fabricCanvasRef, gridLayerRef]);
  
  // Toggle visibility
  const toggleExpanded = useCallback(() => {
    const newState = !expanded;
    setExpanded(newState);
    
    if (newState) {
      refreshGridInfo();
    }
  }, [expanded, refreshGridInfo]);
  
  if (!visible) return null;
  
  return (
    <div className="absolute bottom-4 right-4 z-50 text-xs">
      {!expanded ? (
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 w-8 rounded-full p-0 bg-white/90"
          onClick={toggleExpanded}
        >
          <Bug className="h-4 w-4" />
        </Button>
      ) : (
        <div className="bg-white/90 p-3 rounded shadow w-60">
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold flex items-center">
              <Grid className="h-3 w-3 mr-1" /> Grid Debug
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-5 w-5 p-0"
              onClick={toggleExpanded}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Button 
                size="sm" 
                className="text-xs h-7 px-2"
                onClick={refreshGridInfo}
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Refresh
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-7 px-2"
                onClick={handleFixGrid}
              >
                Fix Grid
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-7 px-2"
                onClick={handleDumpGridState}
              >
                Log Details
              </Button>
            </div>
            
            {gridInfo && (
              <div className="mt-2 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Canvas:</span>
                  <span>{gridInfo.canvasDimensions.width}×{gridInfo.canvasDimensions.height}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grid Objects:</span>
                  <span>{gridInfo.gridObjects} / {gridInfo.gridRefCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Drawing Objects:</span>
                  <span>{gridInfo.drawingObjects}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grid Valid:</span>
                  <span>{gridInfo.gridExists ? '✅' : '❌'}</span>
                </div>
                {gridInfo.issues && gridInfo.issues.length > 0 && (
                  <div className="text-red-500 mt-1">
                    Issues: {gridInfo.issues.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
