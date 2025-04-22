
import { useEffect, useRef, useCallback, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { 
  startLatencyMonitoring, 
  optimizeLatency, 
  getAverageLatency,
  LatencyMeasurement,
  PERFORMANCE_TARGETS
} from '@/utils/canvas/latencyOptimizer';

interface UseLatencyOptimizedCanvasOptions {
  enabled?: boolean;
  onLatencyUpdate?: (measurement: LatencyMeasurement) => void;
}

export function useLatencyOptimizedCanvas(
  canvasRef: React.RefObject<FabricCanvas | null>,
  options: UseLatencyOptimizedCanvasOptions = {}
) {
  const { 
    enabled = true, 
    onLatencyUpdate 
  } = options;
  
  const [latency, setLatency] = useState<LatencyMeasurement | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  
  // Start monitoring when canvas is available
  useEffect(() => {
    if (!enabled || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    console.log('Starting latency monitoring');
    
    // Handle latency measurements
    const handleLatencyUpdate = (measurement: LatencyMeasurement) => {
      setLatency(measurement);
      
      // Auto-optimize if latency is too high
      if (measurement.totalLatency > PERFORMANCE_TARGETS.ACCEPTABLE_FRAME_TIME) {
        optimizeLatency(canvas);
        setIsOptimized(true);
      }
      
      // Call external handler if provided
      if (onLatencyUpdate) {
        onLatencyUpdate(measurement);
      }
    };
    
    // Start monitoring
    const cleanup = startLatencyMonitoring(canvas, handleLatencyUpdate);
    cleanupRef.current = cleanup;
    
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [enabled, canvasRef, onLatencyUpdate]);
  
  // Method to manually trigger optimization
  const optimizeCanvas = useCallback(() => {
    if (canvasRef.current) {
      optimizeLatency(canvasRef.current);
      setIsOptimized(true);
      return true;
    }
    return false;
  }, [canvasRef]);
  
  // Check if latency is within optimal range
  const isLatencyOptimal = useCallback(() => {
    const avgLatency = getAverageLatency();
    return avgLatency ? 
      avgLatency.totalLatency <= PERFORMANCE_TARGETS.OPTIMAL_FRAME_TIME : 
      false;
  }, []);
  
  return {
    latency,
    isOptimized,
    optimizeCanvas,
    isLatencyOptimal
  };
}
