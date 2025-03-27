
/**
 * Grid Debug Overlay Component
 * Provides debugging overlay for grid issues
 * @module GridDebugOverlay
 */
import { useState, useEffect, useRef } from "react";
import { useGridCreationDebug } from "@/hooks/useGridCreationDebug";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Button } from "@/components/ui/button";
import { Bug, RefreshCw, Grid, EyeOff, Eye, Info } from "lucide-react";
import { toast } from "sonner";
import { dumpGridState } from "@/utils/grid/gridDebugUtils";

interface GridDebugOverlayProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  isVisible: boolean;
}

/**
 * Grid Debug Overlay Component
 * Helps diagnose and fix grid rendering issues
 * 
 * @param props Component properties
 * @returns Rendered component
 */
export const GridDebugOverlay = ({ 
  fabricCanvasRef, 
  gridLayerRef,
  isVisible 
}: GridDebugOverlayProps) => {
  const [gridStats, setGridStats] = useState({ exists: false, size: 0, objectsOnCanvas: 0 });
  const [expanded, setExpanded] = useState(true); // Start expanded to make debug info visible
  const [isWorking, setIsWorking] = useState(false);
  const forceGridAttemptRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);
  
  const { 
    debugMode,
    toggleDebugMode,
    forceGridCreation,
    checkGridHealth,
    fixGridIssues
  } = useGridCreationDebug(fabricCanvasRef, gridLayerRef);
  
  // Update grid stats periodically
  useEffect(() => {
    if (!isVisible) return;
    
    const updateStats = () => {
      const now = Date.now();
      // Throttle updates to not spam
      if (now - lastUpdateTimeRef.current < 1000) {
        return;
      }
      lastUpdateTimeRef.current = now;
      
      try {
        const health = checkGridHealth();
        if (health) {
          setGridStats({
            exists: health.exists,
            size: health.size,
            objectsOnCanvas: health.objectsOnCanvas
          });
        } else {
          // Handle the case when checkGridHealth returns false
          setGridStats({
            exists: false,
            size: 0,
            objectsOnCanvas: 0
          });
        }
      } catch (error) {
        console.error("Error updating grid stats:", error);
        // Don't update stats if there was an error
      }
    };
    
    // Update once on mount
    updateStats();
    
    // Then update every 2 seconds
    const interval = setInterval(updateStats, 2000);
    
    return () => clearInterval(interval);
  }, [isVisible, checkGridHealth]);

  // Try creating grid automatically once if missing
  useEffect(() => {
    if (isVisible && fabricCanvasRef.current && gridStats.size === 0 && forceGridAttemptRef.current === 0) {
      // Wait a bit to make sure canvas is fully initialized
      const timer = setTimeout(() => {
        console.log("Auto-attempting grid creation via debug overlay");
        setIsWorking(true);
        try {
          const result = forceGridCreation();
          forceGridAttemptRef.current = 1;
          console.log("Auto grid creation result:", result && result.length ? `${result.length} objects created` : "Failed");
          
          // Dump grid state for debugging
          if (fabricCanvasRef.current) {
            dumpGridState(fabricCanvasRef.current, gridLayerRef);
          }
        } catch (error) {
          console.error("Error in auto grid creation:", error);
        } finally {
          setIsWorking(false);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, fabricCanvasRef, gridStats.size, forceGridCreation, gridLayerRef]);
  
  // Function to handle Force Grid button click with better error handling
  const handleForceGrid = () => {
    console.log("Force grid button clicked");
    forceGridAttemptRef.current += 1;
    setIsWorking(true);
    
    try {
      const grid = forceGridCreation();
      console.log("Force grid created:", grid && grid.length);
      
      if (grid && grid.length > 0) {
        toast.success(`Created ${grid.length} grid objects`);
      } else {
        console.error("Grid creation returned no objects");
        toast.error("Failed to create grid objects");
        
        // If we've tried a few times and it's still not working, show more detailed error
        if (forceGridAttemptRef.current >= 3) {
          const canvasInfo = fabricCanvasRef.current ? {
            width: fabricCanvasRef.current.getWidth?.() || fabricCanvasRef.current.width,
            height: fabricCanvasRef.current.getHeight?.() || fabricCanvasRef.current.height,
            objectCount: fabricCanvasRef.current.getObjects().length
          } : 'null';
          
          console.error("Multiple grid creation attempts failed. Canvas info:", canvasInfo);
          toast.error("Grid creation failed after multiple attempts. Try refreshing the page.");
        }
      }
    } catch (error) {
      console.error("Error during force grid creation:", error);
      toast.error(`Grid creation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsWorking(false);
    }
  };
  
  // Function to fix grid issues with better error handling
  const handleFixGrid = () => {
    console.log("Fix grid button clicked");
    setIsWorking(true);
    
    try {
      const result = fixGridIssues();
      const fixSuccess = result && result.length > 0;
      
      if (fixSuccess) {
        toast.success(`Fixed grid: ${result.length} objects`);
      } else {
        toast.error("Could not fix grid issues");
      }
    } catch (error) {
      console.error("Error fixing grid:", error);
      toast.error(`Error fixing grid: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsWorking(false);
    }
  };
  
  // Always render in floorplans route, but respect isVisible prop
  if (!isVisible) return null;
  
  // Determine status display
  const getMissingStatus = () => {
    if (gridStats.size === 0) {
      return "Missing";
    } else if (gridStats.objectsOnCanvas === 0) {
      return "Not on canvas";
    } else if (gridStats.objectsOnCanvas < gridStats.size) {
      return "Partial";
    } else {
      return "OK";
    }
  };
  
  // Determine status color
  const getStatusColor = () => {
    if (gridStats.size === 0 || gridStats.objectsOnCanvas === 0) {
      return 'bg-red-500';
    } else if (gridStats.objectsOnCanvas < gridStats.size) {
      return 'bg-yellow-500';
    } else {
      return 'bg-green-500';
    }
  };
  
  return (
    <div className="absolute bottom-2 right-2 z-50 bg-white/95 dark:bg-gray-800/95 rounded-md shadow-md p-2 border border-gray-200 dark:border-gray-700 text-xs max-w-[300px]">
      <div className="flex items-center justify-between">
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-6 px-2"
          onClick={() => setExpanded(!expanded)}
        >
          <Bug className="h-3 w-3 mr-1" />
          Grid Debug
        </Button>
        
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full mr-1 ${getStatusColor()}`} />
          <span>{getMissingStatus()}</span>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-2 space-y-2">
          <div>
            <div className="flex justify-between mb-1">
              <span>Grid objects:</span>
              <span className="font-mono">{gridStats.size}</span>
            </div>
            
            <div className="flex justify-between mb-1">
              <span>Objects on canvas:</span>
              <span className="font-mono">{gridStats.objectsOnCanvas}</span>
            </div>
            
            <div className="flex justify-between mb-1">
              <span>Canvas dimensions:</span>
              <span className="font-mono">
                {fabricCanvasRef.current ? 
                  `${fabricCanvasRef.current.getWidth?.() || fabricCanvasRef.current.width || 0}x${fabricCanvasRef.current.getHeight?.() || fabricCanvasRef.current.height || 0}` : 
                  'N/A'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-1">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-6 text-xs px-2"
              onClick={handleForceGrid}
              disabled={isWorking}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isWorking ? 'animate-spin' : ''}`} />
              Force Grid
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="h-6 text-xs px-2"
              onClick={handleFixGrid}
              disabled={isWorking}
            >
              <Grid className="h-3 w-3 mr-1" />
              Fix Grid
            </Button>
            
            <Button 
              size="sm" 
              variant={debugMode ? "default" : "outline"} 
              className="h-6 text-xs px-2"
              onClick={toggleDebugMode}
              disabled={isWorking}
            >
              {debugMode ? 
                <Eye className="h-3 w-3 mr-1" /> : 
                <EyeOff className="h-3 w-3 mr-1" />
              }
              {debugMode ? 'Debug On' : 'Debug Off'}
            </Button>
          </div>
          
          {gridStats.size === 0 && (
            <div className="bg-red-100 p-2 rounded text-red-800 text-xs mt-2">
              <Info className="h-3 w-3 inline mr-1" />
              Failed to create grid. Try the "Force Grid" button or refresh the page.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
