
/**
 * Grid creation utilities
 * @module gridCreationUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from "fabric";
import logger from "./logger";
import { toast } from "sonner";

/**
 * Create a very basic emergency grid when all other methods fail
 * This is a last resort to ensure at least some grid appears
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created emergency grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create emergency grid: canvas is null");
    return [];
  }
  
  try {
    console.log("Creating emergency grid as last resort");
    
    // Show a toast to notify the user
    toast.info("Using simplified grid", {
      id: "emergency-grid-toast",
      duration: 3000
    });
    
    // Clear existing grid objects if any
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    const emergencyGrid: FabricObject[] = [];
    
    // Force canvas dimensions to be valid
    const canvasWidth = Math.max(canvas.width || 800, 800);
    const canvasHeight = Math.max(canvas.height || 600, 600);
    
    // Create a background rectangle to ensure grid is visible
    canvas.backgroundColor = '#ffffff';
    
    // Use larger grid spacing for emergency grid (every 100px)
    const gridSpacing = 100;
    const smallGridSpacing = 20;
    
    // Create vertical large lines (every meter)
    for (let i = 0; i <= canvasWidth + 200; i += gridSpacing) {
      const line = new Line([i, 0, i, canvasHeight + 200], {
        stroke: 'rgba(100,110,120,0.5)',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      emergencyGrid.push(line);
      canvas.add(line);
    }
    
    // Create horizontal large lines (every meter)
    for (let i = 0; i <= canvasHeight + 200; i += gridSpacing) {
      const line = new Line([0, i, canvasWidth + 200, i], {
        stroke: 'rgba(100,110,120,0.5)',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      emergencyGrid.push(line);
      canvas.add(line);
    }
    
    // Create vertical small lines for more detail
    for (let i = 0; i <= canvasWidth + 200; i += smallGridSpacing) {
      // Skip if this would be a large grid line
      if (i % gridSpacing === 0) continue;
      
      const line = new Line([i, 0, i, canvasHeight + 200], {
        stroke: 'rgba(180,185,190,0.3)',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      emergencyGrid.push(line);
      canvas.add(line);
    }
    
    // Create horizontal small lines for more detail
    for (let i = 0; i <= canvasHeight + 200; i += smallGridSpacing) {
      // Skip if this would be a large grid line
      if (i % gridSpacing === 0) continue;
      
      const line = new Line([0, i, canvasWidth + 200, i], {
        stroke: 'rgba(180,185,190,0.3)',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      emergencyGrid.push(line);
      canvas.add(line);
    }
    
    // Add some text markers at key points for scale reference
    const markers = [
      { x: 100, y: 100, text: "1m" },
      { x: 200, y: 200, text: "2m" },
      { x: 100, y: 200, text: "2m²" }
    ];
    
    markers.forEach(marker => {
      const text = new Text(marker.text, {
        left: marker.x,
        top: marker.y,
        fontSize: 12,
        fill: 'rgba(100,110,120,0.8)',
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      emergencyGrid.push(text);
      canvas.add(text);
    });
    
    // Force render
    canvas.requestRenderAll();
    
    // Store in ref
    gridLayerRef.current = emergencyGrid;
    
    console.log(`Emergency grid created with ${emergencyGrid.length} objects`);
    return emergencyGrid;
  } catch (error) {
    console.error("Failed to create emergency grid:", error);
    return [];
  }
};

/**
 * Calculate exponential backoff delay for retries
 * @param {number} attempt - Current attempt number (1-based)
 * @param {number} maxAttempts - Maximum number of attempts
 * @returns {number} Delay in milliseconds
 */
export const calculateBackoffDelay = (attempt: number, maxAttempts: number): number => {
  const baseDelay = 300;
  const maxDelay = 2000;
  return Math.min(baseDelay * Math.pow(1.5, attempt), maxDelay);
};

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} attempt - Current attempt number
 * @param {number} maxAttempts - Maximum number of attempts
 * @returns {number} Timeout ID
 */
export const retryWithBackoff = (
  fn: () => boolean | void,
  attempt: number,
  maxAttempts: number
): number => {
  const delay = calculateBackoffDelay(attempt, maxAttempts);
  console.log(`Scheduling retry #${attempt + 1}/${maxAttempts} in ${delay}ms`);
  
  return window.setTimeout(() => {
    fn();
  }, delay);
};
