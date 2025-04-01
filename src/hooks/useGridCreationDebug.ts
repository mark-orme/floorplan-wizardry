
/**
 * Debug hook for grid creation
 * @module hooks/useGridCreationDebug
 */

import { useCallback, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { 
  runGridDiagnostics, 
  applyGridFixes,
  emergencyGridFix 
} from "@/utils/grid/gridDiagnostics";
import { dumpGridState } from "@/utils/grid/gridDebugUtils";
import logger from "@/utils/logger";

/**
 * Interface for useGridCreationDebug hook props
 */
interface UseGridCreationDebugProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Hook for debugging grid creation issues
 * 
 * @param {UseGridCreationDebugProps} props - Hook props
 * @returns Debug utilities and state
 */
export const useGridCreationDebug = ({ fabricCanvasRef }: UseGridCreationDebugProps) => {
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  // Run diagnostics on the grid
  const runDiagnostics = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      setDiagnosticResults({ error: "Canvas is not available" });
      return;
    }
    
    setIsRunningTests(true);
    
    try {
      // Run diagnostics
      const results = runGridDiagnostics(canvas);
      setDiagnosticResults(results);
      
      // Log to console
      logger.info("Grid diagnostics results:", results);
      
      // Dump grid state
      dumpGridState(canvas);
      
      return results;
    } catch (error) {
      logger.error("Error running grid diagnostics:", error);
      setDiagnosticResults({ error: error instanceof Error ? error.message : String(error) });
      return null;
    } finally {
      setIsRunningTests(false);
    }
  }, [fabricCanvasRef]);
  
  // Apply fixes to the grid
  const applyFixes = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      return null;
    }
    
    try {
      // Run diagnostics first
      const diagnostics = runGridDiagnostics(canvas);
      
      // Apply fixes
      const fixedGrid = applyGridFixes(canvas, diagnostics);
      
      logger.info(`Applied fixes to grid, created/fixed ${fixedGrid.length} objects`);
      
      // Update diagnostic results
      setDiagnosticResults({
        ...diagnostics,
        fixedGrid: fixedGrid.length,
        fixApplied: true
      });
      
      return fixedGrid;
    } catch (error) {
      logger.error("Error applying grid fixes:", error);
      return null;
    }
  }, [fabricCanvasRef]);
  
  // Apply emergency fix
  const applyEmergencyFix = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      return null;
    }
    
    try {
      // Apply emergency fix
      const newGrid = emergencyGridFix(canvas);
      
      logger.info(`Applied emergency grid fix, created ${newGrid.length} objects`);
      
      // Update diagnostic results
      setDiagnosticResults({
        emergencyFixApplied: true,
        newGridObjects: newGrid.length
      });
      
      return newGrid;
    } catch (error) {
      logger.error("Error applying emergency grid fix:", error);
      return null;
    }
  }, [fabricCanvasRef]);
  
  return {
    runDiagnostics,
    applyFixes,
    applyEmergencyFix,
    diagnosticResults,
    isRunningTests
  };
};
