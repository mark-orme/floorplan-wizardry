
import React, { useState, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { dumpGridState } from "@/utils/grid/gridDebugUtils";
import { ensureGridVisibility, forceGridCreationAndVisibility } from "@/utils/grid/gridVisibility";
import { analyzeGridIssues } from "@/utils/grid/errorReporting";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GRID_CONSTANTS } from "@/constants/gridConstants";

interface GridDebugOverlayProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  visible: boolean;
}

export const GridDebugOverlay: React.FC<GridDebugOverlayProps> = ({
  fabricCanvasRef,
  visible
}) => {
  const [gridInfo, setGridInfo] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoFixEnabled, setAutoFixEnabled] = useState(GRID_CONSTANTS.GRID_AUTO_FIX);

  useEffect(() => {
    // Refresh grid info every 2 seconds when visible
    if (!visible) return;
    
    // Initial refresh
    refreshGridInfo();
    
    const intervalId = setInterval(() => {
      refreshGridInfo();
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [visible]);

  if (!visible) return null;

  const canvas = fabricCanvasRef.current;
  if (!canvas) return null;

  const debugInfo = {
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    objectCount: canvas.getObjects().length,
    renderedAt: new Date().toISOString()
  };

  // Function to dump grid state 
  const handleDumpGridState = () => {
    if (canvas) {
      dumpGridState(canvas);
      console.log("Grid state dumped to console");
      toast.info("Grid state dumped to console");
    }
  };
  
  // Function to force grid visibility
  const handleForceVisibility = () => {
    if (canvas) {
      const gridObjects = canvas.getObjects().filter(obj => 
        (obj as any).objectType === 'grid' || (obj as any).isGrid === true
      );
      
      if (gridObjects.length === 0) {
        toast.error("No grid objects found to make visible");
        return;
      }
      
      // Fix: Call ensureGridVisibility with only the canvas argument
      const result = ensureGridVisibility(canvas);
      toast.success(`Grid visibility ${result ? "fixed" : "already OK"}`);
      refreshGridInfo();
    }
  };
  
  // Function to force grid creation
  const handleForceGridCreation = () => {
    if (canvas) {
      const result = forceGridCreationAndVisibility(canvas);
      toast.success(`Grid creation ${result ? "successful" : "failed"}`);
      refreshGridInfo();
    }
  };
  
  // Function to analyze grid issues
  const handleAnalyzeGrid = () => {
    if (!canvas) return;
    
    setIsAnalyzing(true);
    
    try {
      const gridObjects = canvas.getObjects().filter(obj => 
        (obj as any).objectType === 'grid' || (obj as any).isGrid === true
      );
      
      const analysis = analyzeGridIssues(canvas, gridObjects);
      
      setGridInfo({
        gridObjects: gridObjects.length,
        hasIssues: analysis.hasIssues,
        issues: analysis.issues,
        diagnostics: analysis.diagnostics
      });
      
      console.log("Grid analysis:", analysis);
      
      if (analysis.hasIssues) {
        toast.error(`Grid issues found: ${analysis.issues.join(", ")}`);
      } else {
        toast.success("Grid appears healthy");
      }
    } catch (error) {
      console.error("Error analyzing grid:", error);
      toast.error("Error analyzing grid");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Refresh grid info
  const refreshGridInfo = () => {
    if (!canvas) return;
    
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    setGridInfo({
      totalObjects: canvas.getObjects().length,
      gridObjects: gridObjects.length,
      visibleGridObjects: gridObjects.filter(obj => obj.visible).length,
      invisibleGridObjects: gridObjects.filter(obj => !obj.visible).length,
      timestamp: new Date().toISOString()
    });
    
    // Auto-fix if enabled and invisible grid objects are found
    if (autoFixEnabled && gridObjects.filter(obj => !obj.visible).length > 0) {
      handleForceVisibility();
    }
  };
  
  // Toggle auto-fix
  const toggleAutoFix = () => {
    setAutoFixEnabled(prev => !prev);
    toast.info(`Auto-fix ${!autoFixEnabled ? "enabled" : "disabled"}`);
  };

  return (
    <div className="absolute top-2 right-2 bg-white/90 p-3 rounded shadow z-50 text-xs max-w-xs">
      <h4 className="font-bold mb-2">Grid Debug</h4>
      <div className="mb-2">
        <div>Canvas: {debugInfo.canvasWidth}×{debugInfo.canvasHeight}</div>
        <div>Total Objects: {debugInfo.objectCount}</div>
        <div>Rendered: {new Date().toLocaleTimeString()}</div>
      </div>
      
      {gridInfo && (
        <div className="mb-2 p-1 bg-gray-100 rounded">
          <div>Grid Objects: {gridInfo.gridObjects}</div>
          {gridInfo.visibleGridObjects !== undefined && (
            <div>Visible Grid: {gridInfo.visibleGridObjects}</div>
          )}
          {gridInfo.invisibleGridObjects > 0 && (
            <div className="text-red-500">Invisible Grid: {gridInfo.invisibleGridObjects}</div>
          )}
          {gridInfo.hasIssues && (
            <div className="text-red-500">Issues: {gridInfo.issues?.length || 0}</div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-1">
        <Button 
          onClick={handleDumpGridState} 
          variant="outline"
          size="sm"
          className="text-xs h-7"
        >
          Dump State
        </Button>
        
        <Button 
          onClick={handleForceVisibility} 
          variant="outline"
          size="sm"
          className="text-xs h-7"
        >
          Force Visible
        </Button>
        
        <Button 
          onClick={handleForceGridCreation} 
          variant="outline"
          size="sm"
          className="text-xs h-7"
        >
          Recreate Grid
        </Button>
        
        <Button 
          onClick={handleAnalyzeGrid} 
          variant="outline"
          size="sm"
          className="text-xs h-7"
          disabled={isAnalyzing}
        >
          Analyze Grid
        </Button>
        
        <Button 
          onClick={refreshGridInfo} 
          variant="outline"
          size="sm"
          className="text-xs h-7"
        >
          Refresh Info
        </Button>
        
        <Button 
          onClick={toggleAutoFix} 
          variant={autoFixEnabled ? "default" : "outline"}
          size="sm"
          className="text-xs h-7"
        >
          Auto-Fix {autoFixEnabled ? "ON" : "OFF"}
        </Button>
      </div>
    </div>
  );
};
