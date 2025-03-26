
/**
 * Utilities for Fabric.js brushes and drawing tools
 * @module fabricBrush
 */
import { Canvas, PencilBrush } from "fabric";

/**
 * Initialize a drawing brush for a Fabric canvas
 * @param {Canvas} canvas - The Fabric canvas instance
 * @returns {PencilBrush|null} The initialized brush or null if initialization fails
 */
export const initializeDrawingBrush = (canvas: Canvas): PencilBrush | null => {
  if (!canvas) {
    console.error("Cannot initialize brush: canvas is null");
    return null;
  }
  
  try {
    const brush = new PencilBrush(canvas);
    brush.color = "#000000";
    brush.width = 2;
    
    // Improve brush performance and smoothness
    if ('decimate' in brush) {
      (brush as any).decimate = 2;
    }
    
    console.log("Drawing brush initialized successfully");
    return brush;
  } catch (error) {
    console.error("Failed to initialize drawing brush:", error);
    return null;
  }
};

/**
 * Add Pressure sensitivity for Apple Pencil and other stylus devices
 * @param {Canvas} canvas - The Fabric canvas instance
 */
export const addPressureSensitivity = (canvas: Canvas): void => {
  if (!canvas) {
    console.error("Cannot add pressure sensitivity: canvas is null");
    return;
  }
  
  try {
    // Check if stylus is supported in the browser
    const hasStylus = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0 && 
                     ('ontouchstart' in window || (window as any).DocumentTouch);
    
    // Normalize pressure values between stylus and mouse
    canvas.on('mouse:down', (e: any) => {
      if (!canvas.freeDrawingBrush) return;
      
      let pressure = 1; // Default pressure for mouse
      
      // Handle touch events with pressure (Apple Pencil, etc.)
      if (e.e instanceof TouchEvent && e.e.touches[0] && 'force' in e.e.touches[0]) {
        // Normalize Apple Pencil pressure (ranges from 0 to ~1)
        pressure = Math.max(0.2, Math.min(1, e.e.touches[0].force || 1));
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Stylus pressure detected: ${pressure}`);
        }
      }
      
      // Apply consistent line behavior for both stylus and mouse
      const baseWidth = canvas.freeDrawingBrush.width || 2;
      
      // For stylus, adjust width based on pressure
      if (pressure !== 1) {
        // Scale pressure to reasonable brush width (keeping original line width as reference)
        canvas.freeDrawingBrush.width = baseWidth * pressure;
      }
    });
    
    // Reset width on mouse up to ensure consistency
    canvas.on('mouse:up', () => {
      if (canvas.freeDrawingBrush) {
        // Restore original brush width after drawing is complete
        const lineThickness = (canvas as any)._lineThickness || 2;
        canvas.freeDrawingBrush.width = lineThickness;
      }
    });
    
    if (hasStylus) {
      console.log("Stylus support detected and enabled");
    }
    console.log("Pressure sensitivity support added");
  } catch (error) {
    console.error("Error adding pressure sensitivity:", error);
  }
};

/**
 * Track baseline line thickness for consistent reset after pressure changes
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {number} thickness - The baseline thickness to track
 */
export const trackLineThickness = (canvas: Canvas, thickness: number): void => {
  if (!canvas) return;
  
  try {
    // Store the base line thickness in a custom property for reference
    (canvas as any)._lineThickness = thickness;
  } catch (error) {
    console.error("Error tracking line thickness:", error);
  }
};
