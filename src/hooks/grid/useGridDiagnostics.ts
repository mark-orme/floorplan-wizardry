
/**
 * Grid diagnostics hook
 * Handles grid diagnostics and fixes
 * @module hooks/grid/useGridDiagnostics
 */
import { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { runGridDiagnostics, applyGridFixes } from "@/utils/grid/gridDiagnostics";

/**
 * Props for the useGridDiagnostics hook
 */
interface UseGridDiagnosticsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Whether the grid has been initialized */
  isGridInitialized: boolean;
}

/**
 * Hook for managing grid diagnostics and automatic repairs
 * 
 * @param {UseGridDiagnosticsProps} props - Hook properties
 * @returns Diagnostic functions
 */
export const useGridDiagnostics = ({
  fabricCanvasRef,
  gridLayerRef,
  isGridInitialized
}: UseGridDiagnosticsProps) => {
  
  /**
   * Run diagnostics on the grid
   * @param {boolean} verbose - Whether to log detailed diagnostics
   * @returns Diagnostic results
   */
  const runDiagnostics = useCallback((verbose = true) => {
    if (fabricCanvasRef.current) {
      return runGridDiagnostics(fabricCanvasRef.current, gridLayerRef.current, verbose);
    }
    return null;
  }, [fabricCanvasRef, gridLayerRef]);
  
  /**
   * Runs periodic grid health checks
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (fabricCanvasRef.current && gridLayerRef.current.length > 0) {
        // Run quick diagnostics - verbose=false to reduce log noise
        const diagnostics = runGridDiagnostics(fabricCanvasRef.current, gridLayerRef.current, false);
        
        // If no grid objects are on canvas, try to fix
        if (diagnostics.gridInfo.objectsOnCanvas === 0 && gridLayerRef.current.length > 0) {
          console.log("Periodic check found missing grid - attempting fix");
          applyGridFixes(fabricCanvasRef.current, gridLayerRef.current);
        }
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [fabricCanvasRef, gridLayerRef]);
  
  return {
    runDiagnostics
  };
};
