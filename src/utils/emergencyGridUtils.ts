/**
 * Emergency grid utilities for handling grid failure recovery
 * @module emergencyGridUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from "fabric";
import logger from "./logger";
import { toast } from "sonner";

// Typings for grid creation parameters
interface EmergencyGridOptions {
  width: number;
  height: number;
  smallGridSize: number;
  largeGridSize: number;
  smallGridColor: string;
  largeGridColor: string;
  smallGridOpacity: number;
  largeGridOpacity: number;
  showMarkers: boolean;
  forceRender: boolean;
  debug: boolean;
}

// Track whether emergency grid has been created to prevent multiple attempts
let emergencyGridCreated = false;
let emergencyGridAttempts = 0;
const MAX_EMERGENCY_ATTEMPTS = 3;

/**
 * Create a fallback grid when the primary grid creation fails
 * Uses a simplified approach to ensure at least basic grid appears
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {EmergencyGridOptions} options - Grid creation options
 * @returns {FabricObject[]} Created grid objects
 */
export const createEmergencyGrid = (
  canvas: FabricCanvas, 
  options: Partial<EmergencyGridOptions> = {}
): FabricObject[] => {
  // Track attempts - if we've tried too many times, don't keep trying
  emergencyGridAttempts++;
  if (emergencyGridAttempts > MAX_EMERGENCY_ATTEMPTS) {
    logger.error(`Emergency grid creation failed after ${MAX_EMERGENCY_ATTEMPTS} attempts`);
    toast.error("Failed to create grid after multiple attempts");
    return [];
  }

  // If grid already created by this utility, don't create again
  if (emergencyGridCreated) {
    logger.info("Emergency grid already created, skipping");
    return [];
  }

  if (!canvas) {
    logger.error("Emergency grid creation failed: Canvas is null");
    return [];
  }

  try {
    logger.warn("Using emergency grid creation as fallback");
    console.log("EMERGENCY GRID: Creating grid with Canvas dimensions:", 
      canvas.width, "x", canvas.height, 
      "DOM element:", canvas.getElement()?.id || "unknown");
    
    // Default options
    const {
      width = canvas.width || 1000,
      height = canvas.height || 800,
      smallGridSize = 20,
      largeGridSize = 100,
      smallGridColor = "rgba(200,200,200,0.3)",
      largeGridColor = "rgba(100,100,100,0.6)",
      smallGridOpacity = 0.3,
      largeGridOpacity = 0.6,
      showMarkers = true,
      forceRender = true,
      debug = true
    } = options;
    
    const gridObjects: FabricObject[] = [];
    
    if (debug) {
      // Check if canvas is initialized properly
      console.log("EMERGENCY GRID DEBUG:", {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        actualCanvasElement: canvas.getElement(),
        elementDimensions: canvas.getElement() ? 
          `${canvas.getElement().width}x${canvas.getElement().height}` : 
          "No element found",
        isDrawingMode: canvas.isDrawingMode,
        zoomLevel: canvas.getZoom(),
        viewportTransform: canvas.viewportTransform
      });
    }
    
    // Create large grid lines (primary lines)
    for (let i = 0; i <= width; i += largeGridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: largeGridColor,
        selectable: false,
        evented: false,
        opacity: largeGridOpacity,
        strokeWidth: 1,
        objectCaching: false
      });
      gridObjects.push(line);
      canvas.add(line);
      
      // Add text markers at major grid lines
      if (showMarkers && i > 0) {
        const text = new Text(`${i / 100}m`, {
          left: i,
          top: 10,
          fontSize: 12,
          fill: largeGridColor,
          selectable: false,
          evented: false,
          objectCaching: false
        });
        gridObjects.push(text);
        canvas.add(text);
      }
    }
    
    for (let i = 0; i <= height; i += largeGridSize) {
      const line = new Line([0, i, width, i], {
        stroke: largeGridColor,
        selectable: false,
        evented: false,
        opacity: largeGridOpacity,
        strokeWidth: 1,
        objectCaching: false
      });
      gridObjects.push(line);
      canvas.add(line);
      
      // Add text markers at major grid lines
      if (showMarkers && i > 0) {
        const text = new Text(`${i / 100}m`, {
          left: 10,
          top: i,
          fontSize: 12,
          fill: largeGridColor,
          selectable: false,
          evented: false,
          objectCaching: false
        });
        gridObjects.push(text);
        canvas.add(text);
      }
    }
    
    // Create small grid lines (less important, for fine measurements)
    // Only add a limited number for performance
    const maxSmallLines = 100; // Limit to prevent performance issues
    let smallLinesAdded = 0;
    
    for (let i = 0; i <= width && smallLinesAdded < maxSmallLines; i += smallGridSize) {
      // Skip if this is already a large grid line
      if (i % largeGridSize === 0) continue;
      
      const line = new Line([i, 0, i, height], {
        stroke: smallGridColor,
        selectable: false,
        evented: false,
        opacity: smallGridOpacity,
        strokeWidth: 0.5,
        objectCaching: false
      });
      gridObjects.push(line);
      canvas.add(line);
      smallLinesAdded++;
    }
    
    for (let i = 0; i <= height && smallLinesAdded < maxSmallLines; i += smallGridSize) {
      // Skip if this is already a large grid line
      if (i % largeGridSize === 0) continue;
      
      const line = new Line([0, i, width, i], {
        stroke: smallGridColor,
        selectable: false,
        evented: false,
        opacity: smallGridOpacity,
        strokeWidth: 0.5,
        objectCaching: false
      });
      gridObjects.push(line);
      canvas.add(line);
      smallLinesAdded++;
    }
    
    // Add a debug marker text in the center to confirm grid is actually visible
    if (debug) {
      const debugMarker = new Text("GRID ORIGIN", {
        left: 150,
        top: 150,
        fontSize: 16,
        fill: "rgba(255,0,0,0.7)",
        selectable: false,
        evented: false,
        objectCaching: false
      });
      gridObjects.push(debugMarker);
      canvas.add(debugMarker);
    }
    
    logger.info(`Emergency grid created with ${gridObjects.length} objects (${smallLinesAdded} small lines)`);
    console.log(`EMERGENCY GRID: Created ${gridObjects.length} objects`);
    
    // Mark that emergency grid has been created
    emergencyGridCreated = true;
    
    // Notify the user
    toast.success("Emergency grid created successfully", {
      id: "emergency-grid-created",
      duration: 3000
    });
    
    // Force redraw if requested
    if (forceRender) {
      canvas.requestRenderAll();
      // Double check with a delayed render to ensure visibility
      setTimeout(() => {
        if (canvas) {
          canvas.requestRenderAll();
        }
      }, 500);
    }
    
    return gridObjects;
  } catch (error) {
    logger.error("Emergency grid creation failed with error:", error);
    console.error("EMERGENCY GRID ERROR:", error);
    toast.error("Failed to create emergency grid");
    return [];
  }
};

/**
 * Reset the emergency grid creation state
 * Useful when you want to try creating the emergency grid again
 */
export const resetEmergencyGridState = () => {
  emergencyGridCreated = false;
  emergencyGridAttempts = 0;
  logger.info("Emergency grid state reset");
};

/**
 * Check if the grid was created using the emergency utility
 * @returns {boolean} True if emergency grid was created
 */
export const wasEmergencyGridCreated = () => {
  return emergencyGridCreated;
};

/**
 * Direct intervention to fix canvas that appears to be in an unstable state
 * Attempts to repair a canvas that's in an initialization loop
 * 
 * @param {FabricCanvas | null} canvas - The fabric canvas instance to repair
 * @param {Function} recreateCallback - Callback to recreate the canvas if needed
 * @returns {boolean} Success state
 */
export const attemptCanvasRepair = (
  canvas: FabricCanvas | null,
  recreateCallback?: () => FabricCanvas | null
): boolean => {
  if (!canvas) {
    logger.error("Cannot repair null canvas");
    return false;
  }
  
  try {
    // Check if canvas has basic properties
    logger.info("Attempting canvas repair");
    console.log("CANVAS REPAIR: Checking canvas state");
    
    // Check if the canvas element exists and is valid
    const canvasElement = canvas.getElement();
    if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
      logger.error("Canvas element is missing or invalid");
      console.error("CANVAS REPAIR: Canvas element is missing or invalid");
      
      // If we have a recreation callback, use it
      if (recreateCallback && typeof recreateCallback === 'function') {
        logger.info("Attempting to recreate canvas");
        const newCanvas = recreateCallback();
        return !!newCanvas;
      }
      
      return false;
    }
    
    // Check canvas dimensions
    if (canvas.width <= 0 || canvas.height <= 0) {
      logger.warn("Canvas has invalid dimensions, attempting to fix");
      canvas.setWidth(canvasElement.width || 800);
      canvas.setHeight(canvasElement.height || 600);
    }
    
    // Ensure canvas is in drawing mode
    canvas.isDrawingMode = true;
    
    // Ensure brush is initialized
    if (!canvas.freeDrawingBrush) {
      logger.warn("Free drawing brush not initialized, attempting to fix");
      canvas.freeDrawingBrush = new (canvas.getConstructor('PencilBrush'))();
      canvas.freeDrawingBrush.width = 2;
      canvas.freeDrawingBrush.color = "#000000";
    }
    
    // Try to refresh the canvas display
    canvas.requestRenderAll();
    
    // Create emergency grid if there's nothing on the canvas
    if (canvas.getObjects().length === 0) {
      logger.info("Canvas is empty, creating emergency grid");
      createEmergencyGrid(canvas, { debug: true });
    }
    
    return true;
  } catch (error) {
    logger.error("Canvas repair failed:", error);
    console.error("CANVAS REPAIR ERROR:", error);
    return false;
  }
};
