
/**
 * Utilities for Fabric.js brush configuration
 * @module fabricBrush
 */
import { Canvas as FabricCanvas, PencilBrush } from "fabric";

/**
 * Initialize drawing brush with optimized settings
 * @param {FabricCanvas} canvas - The Fabric.js canvas
 * @returns {PencilBrush} Configured drawing brush
 */
export const initializeDrawingBrush = (canvas: FabricCanvas): PencilBrush => {
  if (!canvas) {
    console.error("Cannot initialize brush: Canvas is null");
    throw new Error("Canvas is null");
  }
  
  console.log("Initializing drawing brush");
  
  // Create a fresh PencilBrush
  const brush = new PencilBrush(canvas);
  
  // Configure brush settings
  brush.color = "#000000";
  brush.width = 2;
  
  // Set opacity for semi-transparent lines
  brush.opacity = 1.0;
  
  // Set brush to be more responsive by reducing decimate value
  // This reduces the number of points in paths for better performance
  brush.decimate = 2;
  
  // Set canvas brush
  canvas.freeDrawingBrush = brush;
  
  return brush;
};

/**
 * Add pressure sensitivity for stylus input
 * @param {FabricCanvas} canvas - The Fabric.js canvas
 */
export const addPressureSensitivity = (canvas: FabricCanvas): void => {
  if (!canvas) {
    console.error("Cannot add pressure sensitivity: Canvas is null");
    return;
  }
  
  const brush = canvas.freeDrawingBrush as PencilBrush;
  
  try {
    // Check if browser supports Pointer events with pressure
    if (window.PointerEvent && 'pressure' in new PointerEvent('pointerdown')) {
      console.log("Pressure sensitivity supported by browser");
      
      // Set up pressure sensitivity handlers
      const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType === 'pen') {
          const pressure = e.pressure || 0.5;
          console.log("Stylus pressure:", pressure);
          
          // Adjust brush width based on pressure
          brush.width = Math.max(1, pressure * 5);
        }
      };
      
      const canvasElement = canvas.getElement();
      canvasElement.addEventListener('pointerdown', onPointerDown);
      
      // Store cleanup function in canvas for later removal
      (canvas as any).pressureSensitivityCleanup = () => {
        canvasElement.removeEventListener('pointerdown', onPointerDown);
      };
    } else {
      console.log("Pressure sensitivity not supported by browser");
    }
  } catch (error) {
    console.error("Error setting up pressure sensitivity:", error);
  }
};

/**
 * Remove pressure sensitivity handlers
 * @param {FabricCanvas} canvas - The Fabric.js canvas
 */
export const removePressureSensitivity = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  if ((canvas as any).pressureSensitivityCleanup) {
    (canvas as any).pressureSensitivityCleanup();
    delete (canvas as any).pressureSensitivityCleanup;
  }
};

/**
 * Track base line thickness for pressure sensitivity calculations
 * @param {FabricCanvas} canvas - The Fabric.js canvas
 * @param {number} baseThickness - Base line thickness
 */
export const trackLineThickness = (canvas: FabricCanvas, baseThickness: number): void => {
  if (!canvas || !canvas.freeDrawingBrush) return;
  
  // Store base thickness as a property for reference in pressure calculations
  (canvas.freeDrawingBrush as any).baseThickness = baseThickness;
};
