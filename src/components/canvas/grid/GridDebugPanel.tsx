
/**
 * Grid Debug Panel
 * Shows grid status and provides controls for troubleshooting
 * @module GridDebugPanel
 */
import { useState, useEffect } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { Grid, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { ensureGrid } from '@/utils/gridCreationUtils';

interface GridDebugPanelProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  visible?: boolean;
}

/**
 * Grid Debug Panel Component
 * Displays current grid status and provides controls to fix grid issues
 * 
 * @param {GridDebugPanelProps} props - Component properties
 * @returns {JSX.Element | null} Rendered component or null if hidden
 */
export const GridDebugPanel: React.FC<GridDebugPanelProps> = ({
  fabricCanvasRef,
  gridLayerRef,
  visible = false
}) => {
  const [gridStats, setGridStats] = useState({
    exists: false,
    size: 0,
    onCanvas: 0
  });
  const [expanded, setExpanded] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  
  // Update grid stats periodically
  useEffect(() => {
    if (!visible) return;
    
    const updateStats = () => {
      const canvas = fabricCanvasRef.current;
      
      if (!canvas) {
        setGridStats({
          exists: false,
          size: 0,
          onCanvas: 0
        });
        return;
      }
      
      // Count grid objects on canvas
      const size = gridLayerRef.current.length;
      const onCanvas = gridLayerRef.current.filter(obj => canvas.contains(obj)).length;
      
      setGridStats({
        exists: size > 0,
        size,
        onCanvas
      });
    };
    
    // Update once on mount
    updateStats();
    
    // Then update every second
    const interval = setInterval(updateStats, 1000);
    
    return () => clearInterval(interval);
  }, [visible, fabricCanvasRef, gridLayerRef]);
  
  /**
   * Force recreation of the grid
   */
  const handleForceGrid = () => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas) {
      toast.error("Canvas not available");
      return;
    }
    
    setIsWorking(true);
    
    try {
      // Remove existing grid objects
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      // Clear the grid layer reference
      gridLayerRef.current = [];
      
      // Ensure grid is created
      const success = ensureGrid(canvas, gridLayerRef);
      
      if (success) {
        toast.success(`Grid recreated with ${gridLayerRef.current.length} objects`);
      } else {
        toast.error("Failed to recreate grid");
      }
    } catch (error) {
      console.error("Error forcing grid recreation:", error);
      toast.error("Error recreating grid");
    } finally {
      setIsWorking(false);
    }
  };
  
  /**
   * Toggle grid visibility
   */
  const toggleGridVisibility = () => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas) {
      toast.error("Canvas not available");
      return;
    }
    
    // Get current visibility by checking the first grid object
    const isVisible = gridLayerRef.current.length > 0 && 
                      gridLayerRef.current[0].visible !== false;
    
    // Toggle visibility
    gridLayerRef.current.forEach(obj => {
      obj.visible = !isVisible;
    });
    
    // Render to apply changes
    canvas.requestRenderAll();
    
    toast.success(`Grid ${isVisible ? 'hidden' : 'shown'}`);
  };
  
  // Don't render if not visible
  if (!visible) return null;
  
  // Get status display
  const getStatusText = () => {
    if (!fabricCanvasRef.current) {
      return "No Canvas";
    }
    
    if (gridStats.size === 0) {
      return "No Grid";
    }
    
    if (gridStats.onCanvas === 0) {
      return "Not On Canvas";
    }
    
    if (gridStats.onCanvas < gridStats.size) {
      return `Partial (${gridStats.onCanvas}/${gridStats.size})`;
    }
    
    return "OK";
  };
  
  // Get status color class
  const getStatusColor = () => {
    if (!fabricCanvasRef.current) {
      return "bg-gray-500";
    }
    
    if (gridStats.size === 0 || gridStats.onCanvas === 0) {
      return "bg-red-500";
    }
    
    if (gridStats.onCanvas < gridStats.size) {
      return "bg-yellow-500";
    }
    
    return "bg-green-500";
  };
  
  return (
    <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-md shadow-md border border-gray-200 dark:border-gray-700 z-50 text-xs">
      <div className="flex items-center justify-between mb-2">
        <button 
          className="flex items-center font-medium"
          onClick={() => setExpanded(!expanded)}
        >
          <Grid className="h-3 w-3 mr-1" />
          Grid Debug
        </button>
        
        <div className="flex items-center ml-4">
          <span className={`h-2 w-2 rounded-full mr-1 ${getStatusColor()}`} />
          <span>{getStatusText()}</span>
        </div>
      </div>
      
      {expanded && (
        <div className="space-y-2">
          <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between mb-1">
              <span>Canvas:</span>
              <span>{fabricCanvasRef.current ? "Available" : "Not Available"}</span>
            </div>
            
            <div className="flex justify-between mb-1">
              <span>Grid Objects:</span>
              <span>{gridStats.size}</span>
            </div>
            
            <div className="flex justify-between mb-1">
              <span>Objects on Canvas:</span>
              <span>{gridStats.onCanvas}</span>
            </div>
            
            {fabricCanvasRef.current && (
              <div className="flex justify-between mb-1">
                <span>Canvas Size:</span>
                <span>
                  {fabricCanvasRef.current.width} x {fabricCanvasRef.current.height}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2 pt-1 border-t border-gray-200 dark:border-gray-700">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-6 text-xs"
              onClick={handleForceGrid}
              disabled={isWorking}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isWorking ? 'animate-spin' : ''}`} />
              Recreate Grid
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="h-6 text-xs"
              onClick={toggleGridVisibility}
              disabled={gridStats.size === 0}
            >
              {gridStats.size > 0 && gridStats.onCanvas > 0 && gridLayerRef.current[0]?.visible !== false ? (
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
          </div>
        </div>
      )}
    </div>
  );
};
