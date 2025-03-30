
/**
 * Grid Monitor Component
 * Monitors grid health and provides self-healing capabilities
 */
import { useEffect, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createReliableGrid } from "@/utils/grid/reliableGridCreation";
import { logGridState } from "@/utils/grid/gridDiagnosticLogger";
import { toast } from "sonner";

interface GridMonitorProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  active?: boolean;
}

/**
 * Grid Monitor Component
 * Silently monitors and repairs grid issues in the background
 */
export const GridMonitor: React.FC<GridMonitorProps> = ({
  fabricCanvasRef,
  gridLayerRef,
  active = true
}) => {
  const [isActive, setIsActive] = useState(false);
  
  // Start monitoring when component mounts or becomes active
  useEffect(() => {
    if (!active) return;
    
    // Function to setup monitoring
    const setupMonitoring = () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) {
        console.log("Cannot start grid monitoring: Canvas not available");
        return;
      }
      
      try {
        setIsActive(true);
        console.log("Grid monitoring started");
        
        // Check grid status initially
        logGridState(canvas, gridLayerRef.current);
        
        // Set up monitoring interval
        const intervalId = setInterval(() => {
          const canvas = fabricCanvasRef.current;
          if (!canvas) return;
          
          // Log current state
          logGridState(canvas, gridLayerRef.current);
          
          // Check if grid needs repair
          const objectsOnCanvas = gridLayerRef.current.filter(obj => canvas.contains(obj)).length;
          
          if (objectsOnCanvas === 0 && gridLayerRef.current.length > 0) {
            console.log("Grid objects exist but none are on canvas, repairing");
            
            // Try to re-add existing objects
            gridLayerRef.current.forEach(obj => {
              if (!canvas.contains(obj)) {
                try {
                  canvas.add(obj);
                } catch (error) {
                  console.error("Failed to re-add grid object:", error);
                }
              }
            });
            
            canvas.requestRenderAll();
          } else if (gridLayerRef.current.length === 0) {
            console.log("No grid objects exist, creating grid");
            createReliableGrid(canvas, gridLayerRef);
          }
        }, 5000);
        
        return () => clearInterval(intervalId);
      } catch (error) {
        console.error("Error starting grid monitoring:", error);
      }
    };
    
    // Wait a bit to ensure canvas is initialized
    const timerId = setTimeout(setupMonitoring, 1000);
    
    // Clean up on unmount
    return () => {
      clearTimeout(timerId);
      setIsActive(false);
    };
  }, [fabricCanvasRef, gridLayerRef, active]);
  
  // Re-run monitoring setup when canvas reference changes
  useEffect(() => {
    if (active && fabricCanvasRef.current && !isActive) {
      setIsActive(true);
      
      // Log initial state
      logGridState(fabricCanvasRef.current, gridLayerRef.current);
      
      // Create grid if needed
      if (gridLayerRef.current.length === 0) {
        createReliableGrid(fabricCanvasRef.current, gridLayerRef);
      }
    }
  }, [fabricCanvasRef.current, active, isActive, gridLayerRef]);
  
  // This is an invisible component
  return null;
};
