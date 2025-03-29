
/**
 * Grid Debug Panel Component
 * Provides debugging information and controls for grid-related issues
 */
import { useState, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Bug, Grid, EyeOff, ChevronUp, ChevronDown, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { captureError } from "@/utils/sentryUtils";
import logger from "@/utils/logger";
import { validateCanvasForGrid, getGridStatus } from "@/utils/grid/gridUtils";

interface GridDebugPanelProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  visible?: boolean;
}

/**
 * Grid Debug Panel Component
 * For debugging grid-related issues with canvas
 */
export const GridDebugPanel = ({
  fabricCanvasRef,
  gridLayerRef,
  visible = true
}: GridDebugPanelProps) => {
  const [expanded, setExpanded] = useState(false);
  const [canvasState, setCanvasState] = useState<Record<string, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Update canvas state periodically
  useEffect(() => {
    if (!visible) return;
    
    const updateCanvasState = () => {
      try {
        const canvas = fabricCanvasRef.current;
        const gridObjects = gridLayerRef.current;
        
        if (!canvas) {
          setCanvasState({
            timestamp: new Date().toISOString(),
            canvas: 'Missing',
            error: 'Canvas reference is null'
          });
          return;
        }
        
        // Get detailed canvas and grid status
        const status = getGridStatus(canvas, gridObjects);
        setCanvasState(status);
      } catch (error) {
        console.error("Error updating canvas state:", error);
        setCanvasState({
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error)
        });
      }
    };
    
    // Update immediately
    updateCanvasState();
    
    // Update every 3 seconds
    const intervalId = setInterval(updateCanvasState, 3000);
    
    return () => clearInterval(intervalId);
  }, [visible, fabricCanvasRef, gridLayerRef]);
  
  // Function to analyze canvas
  const analyzeCanvas = () => {
    try {
      setIsAnalyzing(true);
      
      const canvas = fabricCanvasRef.current;
      if (!canvas) {
        toast.error("Cannot analyze: Canvas is null");
        return;
      }
      
      // Check if canvas is valid for grid
      const isValid = validateCanvasForGrid(canvas);
      
      // Get all objects on canvas
      const allObjects = canvas.getObjects();
      
      // Get grid objects
      const gridObjects = gridLayerRef.current;
      
      // Create diagnostic info
      const diagnosticInfo = {
        timestamp: new Date().toISOString(),
        canvas: {
          valid: isValid,
          width: canvas.width,
          height: canvas.height,
          totalObjects: allObjects.length,
          objectTypes: allObjects.map(obj => obj.type || 'unknown').reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        },
        grid: {
          total: gridObjects.length,
          onCanvas: gridObjects.filter(obj => canvas.contains(obj)).length
        }
      };
      
      // Log diagnostic info
      console.log("Canvas diagnostic:", diagnosticInfo);
      logger.info("Canvas diagnostic:", diagnosticInfo);
      
      // Report to Sentry as diagnostic
      captureError(
        new Error("Canvas grid diagnostic"),
        "canvas-grid-diagnostic",
        {
          level: "info",
          extra: diagnosticInfo
        }
      );
      
      // Show success toast
      toast.success("Canvas analysis complete");
      
      // Update canvas state
      setCanvasState(prev => ({
        ...prev,
        diagnostic: diagnosticInfo
      }));
    } catch (error) {
      console.error("Error analyzing canvas:", error);
      toast.error(`Analysis error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // If not visible, don't render
  if (!visible) {
    return null;
  }
  
  // Helper function to determine status color
  const getStatusColor = () => {
    if (!fabricCanvasRef.current) return "bg-red-500";
    if (canvasState.grid?.total === 0) return "bg-red-500";
    if (canvasState.grid?.onCanvas === 0) return "bg-red-500";
    if (canvasState.grid?.onCanvas < canvasState.grid?.total) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  return (
    <div className="absolute bottom-2 right-2 z-50">
      <Card className="p-2 shadow-md bg-white/90 border-gray-200 text-xs w-64">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bug className="h-3 w-3 mr-1" />
            <span className="font-medium">Grid Debug</span>
          </div>
          
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-2 space-y-2">
            <div className="bg-gray-100 p-2 rounded text-xs">
              <div className="grid grid-cols-2 gap-1">
                <div>Canvas:</div>
                <div className="font-mono">
                  {!fabricCanvasRef.current ? (
                    <Badge variant="destructive" className="text-[0.6rem]">Missing</Badge>
                  ) : canvasState.canvas?.valid === false ? (
                    <Badge variant="destructive" className="text-[0.6rem]">Invalid</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[0.6rem] bg-green-50">
                      {canvasState.canvas?.width || 0}x{canvasState.canvas?.height || 0}
                    </Badge>
                  )}
                </div>
                
                <div>Grid objects:</div>
                <div className="font-mono">
                  {canvasState.grid?.total || 0}
                </div>
                
                <div>On canvas:</div>
                <div className="font-mono">
                  {canvasState.grid?.onCanvas || 0}
                </div>
                
                <div>Status:</div>
                <div className="font-mono">
                  {!fabricCanvasRef.current ? (
                    <Badge variant="destructive" className="text-[0.6rem]">No Canvas</Badge>
                  ) : canvasState.grid?.total === 0 ? (
                    <Badge variant="destructive" className="text-[0.6rem]">No Grid</Badge>
                  ) : canvasState.grid?.onCanvas === 0 ? (
                    <Badge variant="destructive" className="text-[0.6rem]">Not Visible</Badge>
                  ) : canvasState.grid?.onCanvas < canvasState.grid?.total ? (
                    <Badge variant="secondary" className="text-[0.6rem] bg-yellow-100">Partial</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[0.6rem] bg-green-50">OK</Badge>
                  )}
                </div>
              </div>
            </div>
            
            {canvasState.error && (
              <div className="bg-red-50 p-2 rounded text-red-800 text-xs flex items-start">
                <AlertCircle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                <div className="overflow-hidden text-ellipsis">{canvasState.error}</div>
              </div>
            )}
            
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-6 text-xs w-full"
                onClick={analyzeCanvas}
                disabled={isAnalyzing || !fabricCanvasRef.current}
              >
                <Bug className="h-3 w-3 mr-1" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Canvas'}
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="h-6 text-xs w-full"
                onClick={() => {
                  // Force refresh by clearing the console
                  console.clear();
                  window.location.reload();
                }}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset Canvas
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
