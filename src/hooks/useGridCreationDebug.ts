
/**
 * Debug hook for grid creation
 * @module hooks/useGridCreationDebug
 */

import { useCallback, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { 
  runGridDiagnostics, 
  applyGridFixes,
  emergencyGridFix 
} from "@/utils/grid/gridDiagnostics";
import logger from "@/utils/logger";

// Add utility function since it's missing
const dumpGridState = (canvas: FabricCanvas) => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(
    obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  console.log("Grid state:", {
    gridObjectCount: gridObjects.length,
    canvasDimensions: { width: canvas.width, height: canvas.height },
    visibleGridObjects: gridObjects.filter(obj => obj.visible).length
  });
};

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
      // Apply fixes
      const fixedResult = applyGridFixes(canvas);
      
      logger.info("Applied fixes to grid:", fixedResult);
      
      // Update diagnostic results
      setDiagnosticResults({
        ...fixedResult,
        fixedGridCount: fixedResult.fixedGrid ? fixedResult.fixedGrid.length : 0
      });
      
      return fixedResult.fixedGrid;
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
