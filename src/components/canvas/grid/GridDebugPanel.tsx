
/**
 * Grid Debug Panel Component
 * Provides debugging information and controls for grid-related issues
 */
import { useState, useEffect, useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Bug, Grid, EyeOff, ChevronUp, ChevronDown, AlertCircle, Tool, Zap } from "lucide-react";
import { toast } from "sonner";
import { captureError } from "@/utils/sentryUtils";
import logger from "@/utils/logger";
import { validateCanvasForGrid, getGridStatus } from "@/utils/grid/gridUtils";
import { runGridDiagnostics, applyGridFixes, emergencyGridFix } from "@/utils/grid/gridDiagnostics";

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
  const [emergencyMode, setEmergencyMode] = useState(false);
  
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
  const analyzeCanvas = useCallback(() => {
    try {
      setIsAnalyzing(true);
      
      const canvas = fabricCanvasRef.current;
      if (!canvas) {
        toast.error("Cannot analyze: Canvas is null");
        return;
      }
      
      // Use diagnostics utility
      const diagnostics = runGridDiagnostics(canvas, gridLayerRef.current, true);
      
      // Show diagnostic results
      if (diagnostics.status === 'critical') {
        toast.error("Critical grid issues found", {
          description: diagnostics.issues.join(', '),
          duration: 5000
        });
      } else if (diagnostics.status === 'warning') {
        toast.warning("Grid issues found", {
          description: diagnostics.issues.join(', '),
          duration: 4000
        });
      } else {
        toast.success("Grid appears healthy");
      }
      
      // Log diagnostic info
      console.log("Canvas diagnostic:", diagnostics);
      logger.info("Canvas diagnostic:", diagnostics);
      
      // Report to Sentry as diagnostic
      captureError(
        new Error("Canvas grid diagnostic"),
        "canvas-grid-diagnostic",
        {
          level: "info",
          extra: diagnostics
        }
      );
      
      // Update canvas state
      setCanvasState(prev => ({
        ...prev,
        diagnostic: diagnostics
      }));
    } catch (error) {
      console.error("Error analyzing canvas:", error);
      toast.error(`Analysis error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [fabricCanvasRef, gridLayerRef]);
  
  // Function to fix grid issues
  const fixGridIssues = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      toast.error("Cannot fix: Canvas is null");
      return;
    }
    
    try {
      toast.loading("Attempting to fix grid issues...", {
        id: "grid-fix",
        duration: 1000
      });
      
      const fixesApplied = applyGridFixes(canvas, gridLayerRef.current);
      
      if (fixesApplied) {
        toast.success("Grid issues fixed successfully", {
          id: "grid-fix",
          duration: 2000
        });
      } else {
        toast.info("No issues to fix or fixes unsuccessful", {
          id: "grid-fix"
        });
      }
      
      // Force analysis update
      analyzeCanvas();
    } catch (error) {
      console.error("Error fixing grid:", error);
      toast.error(`Fix error: ${error instanceof Error ? error.message : String(error)}`, {
        id: "grid-fix"
      });
    }
  }, [fabricCanvasRef, gridLayerRef, analyzeCanvas]);
  
  // Emergency grid creation
  const createEmergencyGrid = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      toast.error("Cannot create emergency grid: Canvas is null");
      return;
    }
    
    try {
      toast.loading("Creating emergency grid...", {
        id: "emergency-grid",
        duration: 2000
      });
      
      setEmergencyMode(true);
      
      // Try emergency fix
      const success = emergencyGridFix(canvas, gridLayerRef);
      
      if (success) {
        toast.success("Emergency grid created", {
          id: "emergency-grid",
          duration: 3000
        });
        
        // Force analysis update
        analyzeCanvas();
      } else {
        toast.error("Emergency grid creation failed", {
          id: "emergency-grid"
        });
      }
    } catch (error) {
      console.error("Error creating emergency grid:", error);
      toast.error(`Emergency grid error: ${error instanceof Error ? error.message : String(error)}`, {
        id: "emergency-grid"
      });
    }
  }, [fabricCanvasRef, gridLayerRef, analyzeCanvas]);
  
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
            {emergencyMode && (
              <Badge variant="destructive" className="ml-1 text-[0.6rem]">Emergency</Badge>
            )}
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
                {isAnalyzing ? 'Analyzing...' : 'Analyze Grid'}
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="h-6 text-xs w-full"
                onClick={fixGridIssues}
                disabled={isAnalyzing || !fabricCanvasRef.current}
              >
                <Tool className="h-3 w-3 mr-1" />
                Fix Issues
              </Button>
            </div>
            
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-6 text-xs w-full"
                onClick={createEmergencyGrid}
                disabled={isAnalyzing || !fabricCanvasRef.current}
              >
                <Zap className="h-3 w-3 mr-1" />
                Emergency Grid
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
