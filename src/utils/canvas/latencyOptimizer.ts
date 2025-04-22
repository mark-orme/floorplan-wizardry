/**
 * Latency optimization utilities for canvas operations
 * Helps measure and reduce end-to-end drawing latency
 */
import { Canvas as FabricCanvas } from 'fabric';
import { debounce } from '@/utils/debounce';

// Performance constants
export const PERFORMANCE_TARGETS = {
  OPTIMAL_FRAME_TIME: 12, // Target 12ms per frame (83+ FPS)
  ACCEPTABLE_FRAME_TIME: 16, // 16ms (60 FPS)
  POOR_FRAME_TIME: 32 // 32ms (30 FPS)
};

// Latency measurement
export interface LatencyMeasurement {
  frameTime: number;
  eventToRafLatency: number;
  renderTime: number;
  totalLatency: number;
  timestamp: number;
}

// Performance optimizations tracking
interface OptimizationState {
  webglEnabled: boolean;
  offscreenCanvasEnabled: boolean;
  mainThreadOptimized: boolean;
  lastMeasurement: LatencyMeasurement | null;
  measurements: LatencyMeasurement[];
  rafCallbackId: number | null;
}

// Initialize state
const state: OptimizationState = {
  webglEnabled: false,
  offscreenCanvasEnabled: false,
  mainThreadOptimized: false,
  lastMeasurement: null,
  measurements: [],
  rafCallbackId: null
};

// Check for WebGL support
const hasWebGLSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};

// Check for OffscreenCanvas support
const hasOffscreenCanvasSupport = (): boolean => {
  return typeof OffscreenCanvas !== 'undefined';
};

/**
 * Start measuring canvas latency
 * @param canvas Fabric canvas instance
 * @param onUpdate Callback for latency updates
 */
export function startLatencyMonitoring(
  canvas: FabricCanvas,
  onUpdate?: (measurement: LatencyMeasurement) => void
): () => void {
  if (!canvas) return () => {};
  
  let lastEventTime = 0;
  let lastRafStartTime = 0;
  
  // Feature detection
  state.webglEnabled = hasWebGLSupport();
  state.offscreenCanvasEnabled = hasOffscreenCanvasSupport();
  
  // Event latency measurement
  const handlePointerEvent = () => {
    lastEventTime = performance.now();
  };
  
  // Frame measurement
  const measureFrame = () => {
    const rafStartTime = performance.now();
    const eventToRafLatency = lastEventTime > 0 ? rafStartTime - lastEventTime : 0;
    
    // Measure render time
    const beforeRender = performance.now();
    canvas.renderAll();
    const afterRender = performance.now();
    
    const renderTime = afterRender - beforeRender;
    const frameTime = afterRender - rafStartTime;
    const totalLatency = eventToRafLatency + renderTime;
    
    // Store measurement
    const measurement: LatencyMeasurement = {
      frameTime,
      eventToRafLatency,
      renderTime,
      totalLatency,
      timestamp: rafStartTime
    };
    
    state.lastMeasurement = measurement;
    state.measurements.push(measurement);
    
    // Keep only recent measurements
    if (state.measurements.length > 60) {
      state.measurements.shift();
    }
    
    // Update caller if callback provided
    if (onUpdate) {
      onUpdate(measurement);
    }
    
    // Schedule next measurement
    state.rafCallbackId = requestAnimationFrame(measureFrame);
    
    // Track RAF start time for next cycle
    lastRafStartTime = rafStartTime;
  };
  
  // Attach pointer event handlers
  const canvasElement = canvas.getElement();
  canvasElement.addEventListener('pointerdown', handlePointerEvent, { passive: true });
  canvasElement.addEventListener('pointermove', handlePointerEvent, { passive: true });
  
  // Start measurement loop
  state.rafCallbackId = requestAnimationFrame(measureFrame);
  
  // Return cleanup function
  return () => {
    if (state.rafCallbackId !== null) {
      cancelAnimationFrame(state.rafCallbackId);
      state.rafCallbackId = null;
    }
    
    canvasElement.removeEventListener('pointerdown', handlePointerEvent);
    canvasElement.removeEventListener('pointermove', handlePointerEvent);
  };
}

/**
 * Apply latency optimizations based on measurements
 * @param canvas Fabric canvas instance
 */
export function optimizeLatency(canvas: FabricCanvas): void {
  if (!canvas || !state.lastMeasurement) return;
  
  const { totalLatency } = state.lastMeasurement;
  
  // Apply optimizations based on measured performance
  if (totalLatency > PERFORMANCE_TARGETS.POOR_FRAME_TIME) {
    // Critical optimization needed
    canvas.skipOffscreen = true;
    canvas.enableRetinaScaling = false;
    
    // Disable object caching temporarily during drawing operations
    if (canvas.isDrawingMode) {
      canvas.getObjects().forEach(obj => {
        obj.objectCaching = false;
      });
    }
    
    // Init WebGL rendering if available and not already enabled
    if (state.webglEnabled && !state.mainThreadOptimized) {
      tryEnableWebGL(canvas);
    }
  }
  else if (totalLatency > PERFORMANCE_TARGETS.ACCEPTABLE_FRAME_TIME) {
    // Some optimization needed
    canvas.skipOffscreen = true;
    canvas.renderOnAddRemove = false;
  }
  
  // Track optimization state
  state.mainThreadOptimized = true;
}

/**
 * Get average latency from recent measurements
 * @returns Average latency measurement
 */
export function getAverageLatency(): LatencyMeasurement | null {
  if (state.measurements.length === 0) return null;
  
  const sum = state.measurements.reduce(
    (acc, m) => ({
      frameTime: acc.frameTime + m.frameTime,
      eventToRafLatency: acc.eventToRafLatency + m.eventToRafLatency,
      renderTime: acc.renderTime + m.renderTime,
      totalLatency: acc.totalLatency + m.totalLatency,
      timestamp: acc.timestamp
    }),
    {
      frameTime: 0,
      eventToRafLatency: 0,
      renderTime: 0,
      totalLatency: 0,
      timestamp: Date.now()
    }
  );
  
  const count = state.measurements.length;
  
  return {
    frameTime: sum.frameTime / count,
    eventToRafLatency: sum.eventToRafLatency / count,
    renderTime: sum.renderTime / count,
    totalLatency: sum.totalLatency / count,
    timestamp: sum.timestamp
  };
}

/**
 * Try to enable WebGL rendering for the canvas
 * @param canvas Fabric canvas instance
 * @returns Success status
 */
function tryEnableWebGL(canvas: FabricCanvas): boolean {
  try {
    // This approach varies based on fabric.js version and setup
    // For newer versions, we'd use a different approach
    if (typeof canvas['setBackstoreOnly'] === 'function') {
      canvas['setBackstoreOnly'](true);
      return true;
    }
    return false;
  } catch (e) {
    console.warn('WebGL optimization failed:', e);
    return false;
  }
}

/**
 * Create debounced optimized render function
 * @param canvas Fabric canvas instance
 * @returns Debounced render function
 */
export function createOptimizedRender(canvas: FabricCanvas) {
  return debounce(() => {
    // Measure render time
    const start = performance.now();
    canvas.renderAll();
    const end = performance.now();
    
    // Apply additional optimizations if rendering is slow
    if (end - start > PERFORMANCE_TARGETS.ACCEPTABLE_FRAME_TIME) {
      optimizeLatency(canvas);
    }
  }, 0); // Using 0 to run on next event loop but not delay visible updates
}
