
import React, { useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Database, Grid, RefreshCw } from "lucide-react";
import { 
  runGridDiagnostics,
  applyGridFixes,
  emergencyGridFix
} from "@/utils/grid/gridDiagnostics";
import {
  testGridCreationCapabilities,
  analyzeGridRendering,
  showGridTestPattern
} from "@/utils/grid/gridTester";
import logger from "@/utils/logger";

interface GridDiagnosticToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  visible?: boolean;
}

export const GridDiagnosticTools: React.FC<GridDiagnosticToolsProps> = ({
  fabricCanvasRef,
  visible = false
}) => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Run diagnostics
  const handleRunDiagnostics = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      setResults({ error: "Canvas is not available" });
      return;
    }
    
    setLoading(true);
    
    try {
      const diagnostics = runGridDiagnostics(canvas);
      setResults(diagnostics);
    } catch (error) {
      logger.error("Error running grid diagnostics:", error);
      setResults({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  }, [fabricCanvasRef]);
  
  // Apply fixes
  const handleApplyFixes = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      setResults({ error: "Canvas is not available" });
      return;
    }
    
    setLoading(true);
    
    try {
      const diagnostics = runGridDiagnostics(canvas);
      const fixedGrid = applyGridFixes(canvas, diagnostics);
      
      setResults({
        ...diagnostics,
        fixedGrid: fixedGrid.length,
        fixApplied: true
      });
    } catch (error) {
      logger.error("Error applying grid fixes:", error);
      setResults({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  }, [fabricCanvasRef]);
  
  // Emergency fix
  const handleEmergencyFix = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      setResults({ error: "Canvas is not available" });
      return;
    }
    
    setLoading(true);
    
    try {
      const newGrid = emergencyGridFix(canvas);
      
      setResults({
        emergencyFixApplied: true,
        newGridObjects: newGrid.length
      });
    } catch (error) {
      logger.error("Error applying emergency grid fix:", error);
      setResults({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  }, [fabricCanvasRef]);
  
  if (!visible) return null;
  
  return (
    <div className="bg-white p-4 rounded shadow absolute bottom-4 right-4 z-50 text-xs">
      <div className="font-bold mb-2 flex items-center">
        <Database className="w-3 h-3 mr-1" />
        Grid Diagnostic Tools
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Button 
          size="sm" 
          className="text-xs h-7"
          onClick={handleRunDiagnostics}
          disabled={loading}
        >
          Run Diagnostics
        </Button>
        
        <Button 
          size="sm" 
          className="text-xs h-7"
          onClick={handleApplyFixes}
          disabled={loading}
          variant="outline"
        >
          Apply Fixes
        </Button>
      </div>
      
      <Button 
        size="sm" 
        className="text-xs w-full h-7 mb-2"
        onClick={handleEmergencyFix}
        disabled={loading}
        variant="destructive"
      >
        <AlertCircle className="w-3 h-3 mr-1" />
        Emergency Grid Reset
      </Button>
      
      <Separator className="my-2" />
      
      {results && (
        <div className="mt-2">
          {results.error ? (
            <div className="text-red-500">{results.error}</div>
          ) : (
            <div className="space-y-1">
              <div>Canvas: {results.hasCanvas ? '✅' : '❌'}</div>
              <div>Grid exists: {results.gridExists ? '✅' : '❌'}</div>
              <div>Grid count: {results.gridCount}</div>
              {results.issues && results.issues.length > 0 && (
                <div className="text-red-500">
                  Issues: {results.issues.join(', ')}
                </div>
              )}
              {results.fixApplied && (
                <div className="text-green-500">
                  Fixes applied: {results.fixedGrid} objects
                </div>
              )}
              {results.emergencyFixApplied && (
                <div className="text-green-500">
                  Emergency fix applied: {results.newGridObjects} objects
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
