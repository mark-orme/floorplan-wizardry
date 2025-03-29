
/**
 * Grid Debug Panel
 * Provides real-time diagnostics and controls for grid troubleshooting
 * @module components/canvas/grid/GridDebugPanel
 */
import { useState, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bug, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { validateCanvasForGrid } from "@/utils/grid/gridUtils";
import { createReliableGrid } from "@/utils/grid/reliableGridCreation";

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
  const [expanded, setExpanded] = useState(false);
  const [diagnostics, setDiagnostics] = useState<Record<string, any>>({});
  const [refreshCount, setRefreshCount] = useState(0);
  
  // Run diagnostics
  useEffect(() => {
    if (!visible) return;
    
    const runDiagnostics = () => {
      const canvas = fabricCanvasRef.current;
      
      const diag: Record<string, any> = {
        timestamp: new Date().toISOString(),
        canvas: {
          available: !!canvas,
          width: canvas?.width || 0,
          height: canvas?.height || 0,
          valid: canvas ? validateCanvasForGrid(canvas) : false,
          objectCount: canvas?.getObjects()?.length || 0
        },
        grid: {
          objectCount: gridLayerRef.current?.length || 0,
          onCanvas: canvas ? gridLayerRef.current.filter(obj => canvas.contains(obj)).length : 0
        }
      };
      
      setDiagnostics(diag);
    };
    
    // Run diagnostics immediately and then on interval
    runDiagnostics();
    const intervalId = setInterval(runDiagnostics, 2000);
    
    return () => clearInterval(intervalId);
  }, [visible, fabricCanvasRef, gridLayerRef, refreshCount]);
  
  const handleForceGridCreation = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      toast.error("Canvas not available");
      return;
    }
    
    try {
      toast.loading("Creating grid...");
      const gridObjects = createReliableGrid(canvas, gridLayerRef);
      
      if (gridObjects.length > 0) {
        toast.success(`Grid created with ${gridObjects.length} objects`);
        setRefreshCount(prev => prev + 1);
      } else {
        toast.error("Grid creation failed: No objects created");
      }
    } catch (error) {
      toast.error(`Grid creation error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!expanded ? (
        <Button 
          variant="secondary" 
          size="sm"
          className="flex items-center gap-2 shadow-lg"
          onClick={() => setExpanded(true)}
        >
          <Bug className="h-4 w-4" />
          Grid Debug
          {diagnostics.grid?.objectCount === 0 && (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
        </Button>
      ) : (
        <div className="bg-white/95 p-4 rounded-lg shadow-lg max-w-xs w-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm">Grid Diagnostics</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setExpanded(false)}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs space-y-1 mb-3">
            <div className="flex justify-between">
              <span>Canvas:</span>
              <span className={diagnostics.canvas?.valid ? "text-green-600" : "text-red-600"}>
                {diagnostics.canvas?.valid ? "Valid" : "Invalid"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span>{diagnostics.canvas?.width}x{diagnostics.canvas?.height}</span>
            </div>
            <div className="flex justify-between">
              <span>Canvas Objects:</span>
              <span>{diagnostics.canvas?.objectCount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Grid Objects:</span>
              <span className={diagnostics.grid?.objectCount > 0 ? "text-green-600" : "text-red-600"}>
                {diagnostics.grid?.objectCount || 0}
              </span>
            </div>
            {diagnostics.grid?.onCanvas !== undefined && (
              <div className="flex justify-between">
                <span>Grid on Canvas:</span>
                <span>{diagnostics.grid.onCanvas}/{diagnostics.grid.objectCount}</span>
              </div>
            )}
          </div>
          
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleForceGridCreation}
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Force Grid Creation
          </Button>
        </div>
      )}
    </div>
  );
};
