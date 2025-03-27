
/**
 * Grid Debug Overlay Component
 * Provides debugging overlay for grid issues
 * @module GridDebugOverlay
 */
import { useState, useEffect } from "react";
import { useGridCreationDebug } from "@/hooks/useGridCreationDebug";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Button } from "@/components/ui/button";
import { Bug, RefreshCw, Grid, EyeOff, Eye } from "lucide-react";

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
  const [gridStats, setGridStats] = useState({ exists: false, size: 0 });
  const [expanded, setExpanded] = useState(false);
  
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
      const health = checkGridHealth();
      if (health) {
        setGridStats({
          exists: health.exists,
          size: health.size
        });
      } else {
        // Handle the case when checkGridHealth returns false
        setGridStats({
          exists: false,
          size: 0
        });
      }
    };
    
    // Update once on mount
    updateStats();
    
    // Then update every 2 seconds
    const interval = setInterval(updateStats, 2000);
    
    return () => clearInterval(interval);
  }, [isVisible, checkGridHealth]);
  
  // Don't render if not visible
  if (!isVisible) return null;
  
  return (
    <div className="absolute top-2 right-2 z-50 bg-white/90 dark:bg-gray-800/90 rounded-md shadow-md p-2 border border-gray-200 dark:border-gray-700 text-xs">
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
          <div className={`h-2 w-2 rounded-full mr-1 ${gridStats.exists ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{gridStats.exists ? 'OK' : 'Missing'}</span>
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
              <span>Canvas dimensions:</span>
              <span className="font-mono">
                {fabricCanvasRef.current ? 
                  `${fabricCanvasRef.current.getWidth()}x${fabricCanvasRef.current.getHeight()}` : 
                  'N/A'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-1">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-6 text-xs px-2"
              onClick={() => {
                const grid = forceGridCreation();
                console.log("Force grid created:", grid);
              }}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Force Grid
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="h-6 text-xs px-2"
              onClick={fixGridIssues}
            >
              <Grid className="h-3 w-3 mr-1" />
              Fix Grid
            </Button>
            
            <Button 
              size="sm" 
              variant={debugMode ? "default" : "outline"} 
              className="h-6 text-xs px-2"
              onClick={toggleDebugMode}
            >
              {debugMode ? 
                <Eye className="h-3 w-3 mr-1" /> : 
                <EyeOff className="h-3 w-3 mr-1" />
              }
              {debugMode ? 'Debug On' : 'Debug Off'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
