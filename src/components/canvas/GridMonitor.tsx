
/**
 * Grid Monitor Component
 * Monitors grid health and provides self-healing capabilities
 */
import { useEffect, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { startGridMonitoring, stopGridMonitoring, getMonitoringStatus } from "@/utils/grid/gridMonitoring";
import { runGridDiagnostics } from "@/utils/grid/gridDiagnostics";
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
        const started = startGridMonitoring(canvas, gridLayerRef, {
          checkInterval: 5000, // Check every 5 seconds
          autoRepair: true,
          useEmergencyGrid: true
        });
        
        setIsActive(started);
        
        if (started) {
          console.log("Grid monitoring started");
        }
      } catch (error) {
        console.error("Error starting grid monitoring:", error);
      }
    };
    
    // Wait a bit to ensure canvas is initialized
    const timerId = setTimeout(setupMonitoring, 1000);
    
    // Clean up on unmount
    return () => {
      clearTimeout(timerId);
      stopGridMonitoring();
      setIsActive(false);
    };
  }, [fabricCanvasRef, gridLayerRef, active]);
  
  // Re-run monitoring setup when canvas reference changes
  useEffect(() => {
    if (active && fabricCanvasRef.current && !isActive) {
      stopGridMonitoring(); // Stop any existing monitoring
      
      const canvas = fabricCanvasRef.current;
      const started = startGridMonitoring(canvas, gridLayerRef);
      setIsActive(started);
    }
  }, [fabricCanvasRef.current, active, isActive, gridLayerRef]);
  
  // Perform an initial diagnostic on mount
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Small delay to ensure canvas is ready
    const timerId = setTimeout(() => {
      try {
        const diagnostics = runGridDiagnostics(canvas, gridLayerRef.current, false);
        
        // Show a toast for serious issues
        if (diagnostics.status === 'critical') {
          toast.warning("Grid has critical issues, attempting repair");
        }
      } catch (error) {
        console.error("Error running initial diagnostics:", error);
      }
    }, 2000);
    
    return () => clearTimeout(timerId);
  }, [fabricCanvasRef, gridLayerRef]);
  
  // This is an invisible component
  return null;
};
