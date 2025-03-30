
/**
 * Grid monitoring component
 * Monitors and ensures grid reliability
 * @module components/canvas/GridMonitor
 */
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { ensureGridVisibility } from '@/utils/grid/simpleGridCreator';

/**
 * Props for the GridMonitor component
 */
interface GridMonitorProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Whether monitoring is active */
  active?: boolean;
  /** Monitoring interval in ms */
  interval?: number;
}

/**
 * Grid monitoring component
 * Background component that ensures grid reliability
 * 
 * @param {GridMonitorProps} props - Component properties
 * @returns {null} This component doesn't render anything
 */
export const GridMonitor: React.FC<GridMonitorProps> = ({
  fabricCanvasRef,
  gridLayerRef,
  active = true,
  interval = 5000
}) => {
  const lastCheckRef = useRef(0);
  
  // Monitor grid at regular intervals
  useEffect(() => {
    if (!active) return;
    
    const checkGrid = () => {
      const now = Date.now();
      if (now - lastCheckRef.current < 1000) return; // Rate limit
      
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      // Ensure grid is visible
      ensureGridVisibility(canvas, gridLayerRef);
      
      lastCheckRef.current = now;
    };
    
    // Check grid on mount
    checkGrid();
    
    // Set up monitoring interval
    const intervalId = setInterval(checkGrid, interval);
    
    // Clean up
    return () => clearInterval(intervalId);
  }, [active, fabricCanvasRef, gridLayerRef, interval]);
  
  // This component doesn't render anything
  return null;
};
