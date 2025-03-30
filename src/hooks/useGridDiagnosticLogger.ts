
/**
 * Grid Diagnostic Logger Hook
 * Hook for monitoring and diagnosing grid rendering issues
 * @module hooks/useGridDiagnosticLogger
 */
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { logGridState, setupGridDiagnosticMonitoring } from '@/utils/grid/gridDiagnosticLogger';

/**
 * Hook to set up grid diagnostic logging
 * @param {React.MutableRefObject<FabricCanvas | null>} fabricCanvasRef - Reference to the fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 */
export const useGridDiagnosticLogger = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  // Track if monitoring is set up
  const monitoringSetupRef = useRef(false);
  
  // Set up diagnostic monitoring on canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    
    if (canvas && !monitoringSetupRef.current) {
      setupGridDiagnosticMonitoring(canvas);
      monitoringSetupRef.current = true;
      
      // Initial logging of grid state
      logGridState(canvas, gridLayerRef.current);
    }
  }, [fabricCanvasRef.current]);
  
  // Log grid state periodically
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas) return;
    
    // Initial logging
    logGridState(canvas, gridLayerRef.current);
    
    // Set up periodic logging
    const intervalId = setInterval(() => {
      logGridState(canvas, gridLayerRef.current);
    }, 10000); // Log every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [fabricCanvasRef.current, gridLayerRef.current.length]);
  
  // Log when grid layer changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      logGridState(canvas, gridLayerRef.current);
    }
  }, [gridLayerRef.current.length]);
};
