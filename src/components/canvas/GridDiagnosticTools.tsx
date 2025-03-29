
/**
 * Grid Diagnostic Tools Component
 * Provides UI for diagnosing and fixing grid rendering issues
 */
import { useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Wrench, 
  RefreshCw, 
  AlertTriangle, 
  Bug, 
  Grid, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { 
  testGridCreationCapabilities, 
  analyzeGridRendering,
  showGridTestPattern 
} from '@/utils/grid/gridTester';
import { 
  forceGridRepair, 
  checkGridImmediately
} from '@/utils/grid/gridMonitoring';
import { 
  trackGridError, 
  getGridErrorStats,
  clearGridErrorStats 
} from '@/utils/grid/gridErrorTracker';

interface GridDiagnosticToolsProps {
  /** Reference to the fabric canvas */
  fabricCanvas: FabricCanvas | null;
  /** Reference to grid objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Whether to show simple or detailed controls */
  detailed?: boolean;
  /** Callback to force grid creation */
  onForceCreateGrid?: () => void;
}

/**
 * Grid Diagnostic Tools Component
 * Provides debugging and repair tools for grid rendering
 */
export const GridDiagnosticTools: React.FC<GridDiagnosticToolsProps> = ({
  fabricCanvas,
  gridLayerRef,
  detailed = false,
  onForceCreateGrid
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<Record<string, any> | null>(null);
  
  // Run grid test
  const handleRunTest = async () => {
    if (!fabricCanvas) {
      toast.error("Canvas not available");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Run comprehensive analysis
      const results = analyzeGridRendering(fabricCanvas, gridLayerRef);
      setLastResult(results);
      
      if (results.creationCapabilities.success && results.diagnostics.status === 'ok') {
        toast.success("Grid test passed successfully");
      } else {
        toast.warning(
          `Grid test found ${results.recommendations.length} issues`, 
          { description: results.recommendations.join('. ') }
        );
      }
    } catch (error) {
      trackGridError(error, "grid-diagnostic-tool-test");
      toast.error("Error running grid test");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Repair grid
  const handleRepairGrid = () => {
    if (!fabricCanvas) {
      toast.error("Canvas not available");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = forceGridRepair(fabricCanvas, gridLayerRef);
      
      if (success) {
        toast.success("Grid repair completed");
        // Run analysis after repair
        setTimeout(() => {
          const results = analyzeGridRendering(fabricCanvas, gridLayerRef);
          setLastResult(results);
        }, 500);
      } else {
        toast.error("Grid repair failed");
      }
    } catch (error) {
      trackGridError(error, "grid-diagnostic-tool-repair");
      toast.error("Error repairing grid");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show test pattern
  const handleShowTestPattern = () => {
    if (!fabricCanvas) {
      toast.error("Canvas not available");
      return;
    }
    
    showGridTestPattern(fabricCanvas);
  };
  
  // Force grid creation
  const handleForceCreate = () => {
    if (onForceCreateGrid) {
      try {
        onForceCreateGrid();
        toast.success("Force grid recreation initiated");
      } catch (error) {
        trackGridError(error, "grid-diagnostic-tool-force-create");
        toast.error("Error creating grid");
      }
    }
  };
  
  // Basic diagnostic version (simple)
  if (!detailed) {
    return (
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={handleRepairGrid}
          disabled={isLoading || !fabricCanvas}
          className="bg-white/90"
        >
          <Wrench className="h-4 w-4 mr-1" />
          Fix Grid
        </Button>
      </div>
    );
  }
  
  // Detailed diagnostic panel
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white/95 p-3 rounded-lg shadow-lg border border-gray-200 w-72">
      <div className="font-semibold mb-2 flex items-center">
        <Grid className="h-4 w-4 mr-1" />
        Grid Diagnostic Tools
      </div>
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRunTest}
            disabled={isLoading || !fabricCanvas}
            className="flex-1"
          >
            <Bug className="h-4 w-4 mr-1" />
            Test Grid
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleRepairGrid}
            disabled={isLoading || !fabricCanvas}
            className="flex-1"
          >
            <Wrench className="h-4 w-4 mr-1" />
            Repair Grid
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleShowTestPattern}
            disabled={isLoading || !fabricCanvas}
            className="flex-1"
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Test Pattern
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleForceCreate}
            disabled={isLoading || !fabricCanvas || !onForceCreateGrid}
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Force Create
          </Button>
        </div>
        
        {lastResult && (
          <div className="text-xs mt-2 p-2 bg-gray-100 rounded">
            <div className="font-semibold mb-1">Last Test Result:</div>
            <div className="flex items-center">
              {lastResult.creationCapabilities.success ? (
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 text-red-500 mr-1" />
              )}
              Creation: {lastResult.creationCapabilities.success ? 'OK' : 'Failed'}
            </div>
            <div className="flex items-center">
              {lastResult.diagnostics.status === 'ok' ? (
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 text-red-500 mr-1" />
              )}
              Diagnostics: {lastResult.diagnostics.status.toUpperCase()}
            </div>
            {lastResult.recommendations.length > 0 && (
              <div className="mt-1">
                <span className="font-semibold">Fixes needed:</span>
                <ul className="list-disc list-inside">
                  {lastResult.recommendations.slice(0, 3).map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                  {lastResult.recommendations.length > 3 && (
                    <li>...and {lastResult.recommendations.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
