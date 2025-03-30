
import React, { useState, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Button } from "@/components/ui/button";
import { Grid, RotateCcw, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";
import { dumpGridState, forceCreateGrid } from "@/utils/grid/gridDebugUtils";
import { runGridDiagnostics } from "@/utils/grid/gridDiagnostics";

interface GridDebugOverlayProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  visible?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export const GridDebugOverlay: React.FC<GridDebugOverlayProps> = ({
  fabricCanvasRef,
  gridLayerRef,
  visible = false,
  position = "top-right"
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [isExpanded, setIsExpanded] = useState(false);
  const [gridStats, setGridStats] = useState({
    count: 0,
    visibleCount: 0,
    objectsOnCanvas: 0
  });

  // Positioning styles based on the position prop
  const positionStyles = {
    "top-left": "top-2 left-2",
    "top-right": "top-2 right-2",
    "bottom-left": "bottom-2 left-2",
    "bottom-right": "bottom-2 right-2"
  };

  // Update grid stats periodically
  useEffect(() => {
    if (!isVisible) return;

    const updateStats = () => {
      const canvas = fabricCanvasRef.current;
      const gridObjects = gridLayerRef.current;
      
      if (canvas && Array.isArray(gridObjects)) {
        setGridStats({
          count: gridObjects.length,
          visibleCount: gridObjects.filter(obj => obj.visible).length,
          objectsOnCanvas: gridObjects.filter(obj => canvas.contains(obj)).length
        });
      }
    };

    // Initial update
    updateStats();

    // Periodic update
    const intervalId = setInterval(updateStats, 2000);

    return () => clearInterval(intervalId);
  }, [isVisible, fabricCanvasRef, gridLayerRef]);

  // Rebuild grid
  const handleRebuildGrid = () => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) {
      toast.error("Canvas not available");
      return;
    }

    try {
      toast.promise(
        Promise.resolve().then(() => {
          // Force create new grid
          const newGrid = forceCreateGrid(canvas);
          
          // Update grid layer ref
          gridLayerRef.current = newGrid;
          
          // Return the count for the toast
          return newGrid.length;
        }),
        {
          loading: "Rebuilding grid...",
          success: (count) => `Grid rebuilt with ${count} objects`,
          error: "Failed to rebuild grid"
        }
      );
    } catch (error) {
      console.error("Error rebuilding grid:", error);
      toast.error("Failed to rebuild grid");
    }
  };

  // Toggle grid visibility
  const toggleGridVisibility = () => {
    const canvas = fabricCanvasRef.current;
    const gridObjects = gridLayerRef.current;

    if (!canvas || !Array.isArray(gridObjects) || gridObjects.length === 0) {
      toast.error("Grid not available");
      return;
    }

    const newVisibility = !gridObjects[0]?.visible;

    gridObjects.forEach(obj => {
      obj.visible = newVisibility;
    });

    canvas.requestRenderAll();
    toast.success(newVisibility ? "Grid is now visible" : "Grid is now hidden");
  };

  // Run diagnostics
  const runDiagnostics = () => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas) {
      toast.error("Canvas not available for diagnostics");
      return;
    }
    
    const results = runGridDiagnostics(canvas, gridLayerRef.current);
    console.log("Grid diagnostics:", results);
    
    if (results.status === 'ok') {
      toast.success("Grid diagnostic passed ✅");
    } else {
      toast.warning(`Grid issues found: ${results.issues.length}`);
    }
    
    // Dump detailed state to console
    dumpGridState(canvas, gridLayerRef.current);
  };

  if (!isVisible) {
    return (
      <Button
        size="sm"
        variant="outline"
        className={`absolute ${positionStyles[position]} shadow bg-white/80 opacity-70 hover:opacity-100`}
        onClick={() => setIsVisible(true)}
      >
        <Grid className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div
      className={`absolute ${positionStyles[position]} shadow-md bg-white/95 rounded-md border p-3 z-50 text-xs transition-all`}
      style={{ minWidth: "200px" }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold flex items-center">
          <Grid className="h-3 w-3 mr-1" />
          Grid Debug
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-5 w-5 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <X className="h-3 w-3" /> : <Grid className="h-3 w-3" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-5 w-5 p-0"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="grid grid-cols-2 gap-y-1 mb-2">
            <div>Grid objects:</div>
            <div className="font-medium">{gridStats.count}</div>
            <div>Visible:</div>
            <div className="font-medium">{gridStats.visibleCount}</div>
            <div>On canvas:</div>
            <div className="font-medium">{gridStats.objectsOnCanvas}</div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={handleRebuildGrid}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Rebuild Grid
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={toggleGridVisibility}
            >
              {gridLayerRef.current[0]?.visible ? (
                <>
                  <EyeOff className="h-3 w-3 mr-1" />
                  Hide Grid
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 mr-1" />
                  Show Grid
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={runDiagnostics}
            >
              <Grid className="h-3 w-3 mr-1" />
              Run Diagnostics
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
